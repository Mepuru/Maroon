---
title: ESP32-S3 + BLE 门锁折腾全记录 —— 从抓包、解包到六步握手的完整旅程
description: 用 ESP32-S3N16R8 开发板 + ST7789 显示屏实现通过手机浏览器控制 BLE 门锁开锁。从最初构思到最终跑通，经历了抓包、解包小程序源码、逆向 BLE 协议、修复无数个坑的完整记录。
pubDate: 2026-06-12
tags: [ESP32, Arduino, BLE, 嵌入式, 逆向工程, IoT]
---

> 特别感谢 [@Sibuxiangx](https://github.com/Sibuxiangx) 提供的初始思路和技术参考，这篇文章的很多基础工作都建立在他的探索之上。

## 背景

手头有一把支持 BLE 的智能门锁，日常用微信小程序控制倒也没什么问题，但总觉得不够折腾——于是想能不能用 ESP32 来直接控制它，彻底摆脱手机和微信的依赖。硬件基础是 Goouuu Tech ESP32-S3N16R8 核心板，16MB Flash 加 8MB PSRAM，搭配一块 ST7789 240×240 SPI 显示屏。没有多余的按钮，没有额外的 BLE 模块，就这两样东西。目标很明确：在 ESP32 上跑一个 Web 服务器，手机浏览器访问就能开锁，全程不需要任何 App。

## 获取 tokenId 的曲折过程

门锁厂商的 API 需要一个 tokenId 来鉴权，这东西藏在微信小程序的请求体里，得靠抓包获取。我一开始在电脑上装了 Fiddler Classic，配置好 HTTPS 解密，把手机代理到电脑端口，结果发现小程序用了 TLS 1.3，Fiddler 解密不了。换 HTTP Toolkit 试了试，同样的问题——证书装不上，Android 新版本对用户证书的限制越来越严。试了手机端的抓包 App 也不行，证书安装环节总是卡住。折腾了一圈之后意识到，最简单的办法其实就在眼前：电脑微信的小程序流量走的是 Windows 网络栈，直接在电脑上抓包不需要碰手机证书。打开 Fiddler 的系统代理，启动电脑微信打开小程序，API 请求就清清楚楚地列在那里了，`tokenId` 字段就在 POST 请求的 body 里。后来发现 HTTP Toolkit 也能用同样方式抓，但这条弯路走了几个小时才绕回来。

## 搭建项目框架

确定了技术路线之后，我开始搭建整个项目。项目命名为 `02_ble_lock`，放在 Arduino 项目仓库里，和已有的 `01_st7789_demo` 并列。主程序用 Arduino 框架写，核心文件就这么几个：`02_ble_lock.ino` 负责全局调度——WiFi 连接、WebServer 路由、TFT 显示刷新全在这里；`lock_service.h` 封装了所有 BLE 相关的逻辑，从扫描到六步握手都在里边；`web_ui.h` 内嵌了一个响应式的 HTML 控制页面，手机浏览器直接访问 ESP32 的 IP 就能看到；`tft_setup.h` 是 TFT_eSPI 的驱动配置。WiFi 密码和 tokenId 这种敏感信息放在 `config.h` 里，这个文件已经加入了 `.gitignore`，仓库里只保留 `config.example.h` 作为格式参考。

做设计决策的时候有几个考虑。首先是无按钮操作，唯一的交互入口就是手机浏览器，ESP32 只管连接 WiFi、开 HTTP 服务、跑 BLE 协议。其次是实时进度反馈，ST7789 屏幕和 Web 页面通过状态回调同步更新，每走一步都让用户看到当前在做什么。然后是屏幕闪烁问题，TFT_eSPI 的 Sprite 帧缓冲可以离屏绘制内容，然后一次性推送到屏幕，从根本上消灭了闪烁。最后也是最折腾的一个问题——BLE 的初始化策略，后面会细说。

硬件接线方面，ST7789 用 HSPI 模式连接，引脚通过 ESP32-S3 的 GPIO Matrix 任意映射：CS 接 GPIO10、DC 接 GPIO5、RST 接 GPIO6、MOSI 接 GPIO11、SCLK 接 GPIO12、背光接 GPIO21。需要特别注意的是 ESP32-S3 必须用 `USE_HSPI_PORT`，默认的 FSPI 和 Flash 共用总线，初始化就会触发 StoreProhibited 崩溃，这个问题卡了我好一阵子。

## 逆向 BLE 协议

有了 tokenId，ESP32 就可以通过 HTTPS 调用门锁厂商的 API，拿到门锁的 MAC 地址、AES 密钥和认证码。接下来就是最核心的部分——BLE 通信协议。

我手头有一份来自 @Sibuxiangx 的初始代码作为起点，框架搭得挺完整的——先获取 session ID，再拿动态密钥，然后发送认证码，最后发开锁命令。但实际测试的时候问题就来了：前三步都能跑通，偏偏开锁命令总是被锁拒绝，返回 status 6。翻看小程序的错误码表，status 6 的意思是"门锁不支持此命令或操作"，说明命令格式有问题，但问题出在哪里完全看不出来。参数太多了——cmd_ver 对不对？flag 值该设多少？时区偏移单位是分钟还是秒？要不要带 authStartTime？初始版本里这些取值全是错的，没有一个是准的。

与其继续盲猜，不如直接看小程序源码怎么写的。电脑微信的小程序包可以用解包工具拆开，得到一份虽然经过混淆但依然可读的 JavaScript。我在庞大的代码库里找到了关键的 `o_openLock.js` 模块，它的 marshal 函数逐字节地展示了开锁命令的完整构造逻辑。

逐行比对下来发现了六个参数错误。第一是 flag 参数，初始代码用的是 1，但小程序区分了"正常开门"（flag=20）和"远程开锁"（flag=8），我需要的是 8。第二是成功的判断条件，小程序的错误码表里 OPEN_LOCK 的 success code 是 1，不是通常的 0——这意味着整个开锁响应处理逻辑从一开始就是反的，成功的开锁一直在被当成失败处理。第三是时区偏移的单位，小程序里 `getTimezoneOffset()` 返回的是分钟，构造命令时乘以 60 转成了秒，而初始代码直接写了 `8 * 60` 差了一个数量级。第四是 authStartTime，协议版本 21 以上的锁需要在开锁命令中附带 beginTime，这个参数来自 API 的 auth 响应，初始代码完全没有处理。第五是 cmd_ver 的默认值，小程序 codec.js 里硬编码的是 12，初始代码写的是 13，虽然只差 1 但谁也不知道锁会不会认。第六是完整的握手流程，小程序在认证之后还会获取锁的 DNA 信息来读取协议版本，以及同步锁的系统时间，初始代码跳过了这两步，锁也可能因为这个拒绝开锁。

## 调试路上的坑

修复了协议参数之后，开锁成功了，但又冒出新的问题。

第一个是 BLE 扫描不到锁。ESP32 扫描 8 秒能找到五六十个 BLE 设备，但门锁就是不在列表里。排查发现锁的 BLE 广播间隔非常长，手机上用小程序也要等很久才能连上。解决方案是把单次 8 秒扫描改成最多 3 轮，每轮 8 秒，总共 24 秒的扫描窗口，轮次之间让出 CPU 给 WebServer 处理请求。

第二个是反复初始化 BLE 导致 ESP32 崩溃。开锁成功后刷新页面再点一次开锁，ESP32 直接重启，串口输出 Guru Meditation Error。问题出在每次开锁都调用 `init_ble()` 和 `deinit_ble()`，第二次初始化时 BLE 栈内部状态就混乱了。解决方式是用一个标志位记录 BLE 状态，只在第一次真正初始化，之后跳过。ESP32-S3 的 WiFi 和 BLE 共存能力不错，一直开着 BLE 不影响通信。

第三个是锁的自动回锁同步。门锁硬件本身有 4 秒自动回锁功能，开锁成功后需要在网页端同步显示 3 秒倒计时，然后回到锁定状态。我用 `millis()` 计时器实现了一个状态机，在 loop 里每秒检查一次。开锁成功后先显示 "unlocked, relock in 3s"，每秒递减，3 秒后变成 "relocked"，再过 2 秒清除状态回到初始界面。

## 最终的六步握手流程

项目跑通后的完整流程是这样的。ESP32 上电先连接 WiFi，然后从 NVS 读取持久化的 tokenId（如果有），接着同步 NTP 时间，再通过 HTTPS 调用 API 获取门锁列表和 BLE 凭据。最后启动 Web 服务器，等待用户操作。

用户手机浏览器访问 ESP32 的 IP 地址，点击开锁按钮之后，ESP32 开始执行六步 BLE 握手。先扫描门锁的 BLE 广播（最多 3 轮），连接上之后发现 FFF0 服务，注册通知回调，然后依次发送六个命令：GET_SESSION_ID 获取会话 ID、GET_SECRET 获取动态 AES 密钥、GET_AUTH 发送认证码、GET_DNA_INFO 读取锁的协议版本、SET_SYSTEM_TIME 同步锁的系统时钟，最后才是 OPEN_LOCK 开锁命令。如果锁支持新版协议（cmdVer=21）就带上 authStartTime，如果不支持就自动降级到旧版（cmdVer=12）。开锁成功后，页面和屏幕同步显示 3 秒倒计时，然后回到锁定状态。

BLE 通信的帧格式是自定义的：以 HSJ 开头，后面跟总长度、flagProto，然后是 AES-128-ECB 加密的负载，最后是 CRC16 校验。加密负载里包含了 session ID、序列号、命令码、状态、flag、keyGroupId、cmdVer 和 iterable 数据字段。密钥一开始用 API 返回的 aesKey（每把锁独立），在握手第二步会被动态密钥替换。

## 一些收尾的工作

tokenId 虽然有效期大约 4 年，但总有过期的一天。为了让更新 token 不需要重新编译固件，我在 Web 页面加了一个 `/settings` 端点，抓包拿到新 token 后浏览器粘贴保存就行。token 存在 ESP32 的 NVS 里，掉电不丢失，下次开机自动使用。

项目目录在 GitHub 上，`config.h` 被 `.gitignore` 忽略，仓库里只提交 `config.example.h` 作为格式参考。Arduino IDE 的配置要点都写在 README 里了——开发板选 ESP32S3 Dev Module，Flash 16MB，分区用 Huge APP，PSRAM 开 OPI 模式。

回头来看，这个项目涉及的东西还挺杂的：Arduino ESP32 开发（WiFi + BLE + WebServer）、嵌入式显示屏驱动（TFT_eSPI Sprite 帧缓冲）、HTTPS API 对接（WiFiClientSecure + ArduinoJson）、BLE 抓包分析（nRF Connect）、HTTPS 抓包（Fiddler Classic）、微信小程序解包（读 JavaScript 源码逆向协议）、AES 加解密和 CRC16 校验、自定义帧协议的设计与调试，还有嵌入式调试中常见的串口输出和崩溃分析。

心得体会大概有这么几点。首先，源码永远是最好的文档——与其猜协议参数，不如直接看小程序怎么写，解包花了一小时省去了几天的盲猜时间。其次，BLE 和 WiFi 共存的问题在 ESP32-S3 上改善了很多，但反复 init/deinit 仍然会崩，保持 BLE 持久化是最稳的做法。

---

项目完整代码托管在 GitHub：[Mepuru/Arduino-ESP32/tree/main/02_ble_lock](https://github.com/Mepuru/Arduino-ESP32/tree/main/02_ble_lock)

如果你也想在自己门锁上跑起来，需要以下几步。硬件方面需要一块 ESP32-S3 开发板（推荐 16MB Flash + 8MB PSRAM 的版本）和一块 ST7789 显示屏，按文中的接线图连好。软件方面在 Arduino IDE 中安装 ESP32 开发板和 TFT_eSPI、ArduinoJson 两个库，开发板选 ESP32S3 Dev Module，Flash 选 16MB，分区用 Huge APP (3MB No OTA)，PSRAM 开 OPI 模式。

配置方面，复制 `config.example.h` 为 `config.h`，填入 WiFi 信息和你自己抓包获取的 tokenId。tokenId 的获取方式不限，只要能从小程序的 API 请求里提取出来就行——拿到之后如果以后过期了，不需要重新编译固件，直接访问 ESP32 的 `/settings` 页面在线更新即可。

然后编译上传，等屏幕显示 IP 地址，同一 WiFi 下手机浏览器打开那个 IP，就能看到开锁页面了。
