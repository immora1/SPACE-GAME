// src/JS/eventData.js

export const EVENT_DATABASE = {
    // ==============================
    // 轨道 1: LEO (550 km) - 拥挤的低轨
    // ==============================
    550: [
        {
            title: "微陨石超高速撞击",
            enTitle: "IMPACT",
            date: "2025.04.12",
            type: "INCIDENT",
            desc: "警报：侦测到动能撞击事件。一颗直径约 2mm 的微流星体以 7.8km/s 的相对速度击穿了左侧太阳能电池阵列（SA-Left）。撞击产生的等离子体放电导致母线电压瞬时下降，供电效率永久性损失 15%。姿态控制系统正在补偿由撞击产生的角动量。",
            img: "https://placehold.co/600x400/1a1a1a/FFF?text=Impact"
        },
        {
            title: "星链星座过境干扰",
            enTitle: "STARLINK",
            date: "2025.05.20",
            type: "INCIDENT",
            desc: "遭遇高密度卫星群。一批新发射的 Starlink v2.0 卫星正在进行轨道抬升，其中 12 颗卫星从本星上方 5km 处掠过。高频 Ku 波段通信信号造成了严重的背景噪声，合成孔径雷达（SAR）成像信噪比降低至临界值，部分遥测数据包丢失。",
            img: "https://placehold.co/600x400/003366/FFF?text=Starlink"
        },
        {
            title: "Iridium-33 碰撞遗骸",
            enTitle: "COLLISION",
            date: "2009.02.10",
            type: "HISTORY",
            desc: "【历史档案】2009年，美国商业通信卫星 Iridium 33 与俄罗斯废弃军用卫星 Cosmos 2251 在西伯利亚上空发生了一次灾难性的超高速碰撞。这是人类航天史上首次两颗完整卫星在轨相撞，瞬间产生了超过 2300 块可追踪碎片，彻底改变了低轨道的碎片分布模型。",
            img: "https://placehold.co/600x400/1a1a1a/FFF?text=Iridium"
        },
        {
            title: "哈勃陀螺仪故障",
            enTitle: "GYRO FAIL",
            date: "2018.10.05",
            type: "HISTORY",
            desc: "【历史档案】哈勃太空望远镜遭遇严重的指向系统故障。其精密控制所需的陀螺仪因长期磨损失效，备用陀螺仪读数异常。这迫使望远镜进入“安全模式”，暂停所有科学观测。此事件凸显了精密机械部件在长期太空环境下的脆弱性。",
            img: "https://placehold.co/600x400/000033/FFF?text=Hubble"
        },
        {
            title: "火箭解体碎片云",
            enTitle: "DEBRIS",
            date: "2025.07.01",
            type: "INCIDENT",
            desc: "北美防空司令部（NORAD）发出红色预警：一枚废弃的“长征”系列运载火箭末级在附近轨道因剩余燃料压力过大发生解体。雷达散射截面（RCS）显示数千块碎片正在扩散形成环状碎片带，本星需要在 45 分钟内执行紧急变轨机动以规避撞击风险。",
            img: "https://placehold.co/600x400/330000/FFF?text=Debris"
        }
    ],

    // ==============================
    // 轨道 2: SSO (800 km) - 太阳同步轨道
    // ==============================
    800: [
        {
            title: "极地极光电流干扰",
            enTitle: "AURORA",
            date: "2025.09.11",
            type: "INCIDENT",
            desc: "卫星穿越极区时遭遇强烈的地磁暴（Kp指数 > 7）。极光电集流（Auroral Electrojet）在卫星表面感应出异常电流，导致三轴磁力计读数饱和失效。星载计算机检测到单粒子翻转（SEU）错误增加，已自动切换至惯性导航模式。",
            img: "https://placehold.co/600x400/006633/FFF?text=Aurora"
        },
        {
            title: "风云一号C反卫实验",
            enTitle: "FY-1C",
            date: "2007.01.11",
            type: "HISTORY",
            desc: "【历史档案】退役气象卫星 FY-1C 在一次反卫星导弹测试（ASAT）中被击毁。这一事件在 865km 高度瞬间释放了超过 3500 块大尺寸碎片和数十万微小碎片。由于轨道高度较高，这些碎片受大气阻力影响极小，预计将在轨道上滞留数个世纪，成为该高度永久的威胁。",
            img: "https://placehold.co/600x400/990000/FFF?text=FY-1C"
        },
        {
            title: "Envisat 巨型僵尸",
            enTitle: "ENVISAT",
            date: "2012.04.08",
            type: "HISTORY",
            desc: "【历史档案】欧空局重达 8.2 吨的 Envisat 环境监测卫星突然失去联系。由于其体型巨大且未受控，它被称为“轨道上的定时炸弹”。任何与它的碰撞都可能引发凯斯勒效应（Kessler Syndrome），产生连锁反应摧毁整个轨道环境。",
            img: "https://placehold.co/600x400/000000/FFF?text=Envisat"
        },
        {
            title: "紫外传感器老化致盲",
            enTitle: "SENSOR",
            date: "2025.10.05",
            type: "INCIDENT",
            desc: "长期暴露在强紫外线和原子氧环境下，臭氧层探测器的光学镜头涂层出现严重退化。反照率数据校准出现 12% 的偏差，导致无法正确反演大气成分。地面控制中心正在尝试上传新的补偿算法，但部分科学数据可能永久丢失。",
            img: "https://placehold.co/600x400/333333/FFF?text=Sensor"
        },
        {
            title: "冷战核动力残骸",
            enTitle: "NUCLEAR",
            date: "2026.01.10",
            type: "INCIDENT",
            desc: "盖革计数器读数激增。侦测到一颗冷战时期苏联 RORSAT 海洋侦察卫星的反应堆核心冷却剂液滴正在接近。虽然主要核心已推至更高轨道，但遗留的放射性钠钾合金液滴仍漂浮在此高度，辐射干扰导致星敏感器噪点急剧增加。",
            img: "https://placehold.co/600x400/336600/FFF?text=Radiation"
        }
    ],

    // ==============================
    // 轨道 3: MEO (1200 km) - 辐射带边缘
    // ==============================
    1200: [
        {
            title: "范艾伦辐射带侵蚀",
            enTitle: "RADIATION",
            date: "2026.02.14",
            type: "INCIDENT",
            desc: "卫星进入内范艾伦辐射带的高强度质子通量区域。高能粒子穿透了铝制屏蔽层，导致星载电脑发生多次位翻转（Bit-flip）。主控系统触发看门狗（Watchdog）复位重启，有效载荷暂时断电保护。预计需 2 小时完成系统自检恢复。",
            img: "https://placehold.co/600x400/660066/FFF?text=Van+Allen"
        },
        {
            title: "Telstar 1 核爆失效",
            enTitle: "TELSTAR",
            date: "1963.02.21",
            type: "HISTORY",
            desc: "【历史档案】世界上第一颗有源通信卫星 Telstar 1 在发射仅数月后失效。罪魁祸首是美国“海星一号”高空核试验产生的人工辐射带。核爆释放的高能电子流迅速老化了卫星上的晶体管，这给人类敲响了太空环境脆弱性的警钟。",
            img: "https://placehold.co/600x400/660066/FFF?text=Telstar"
        },
        {
            title: "West Ford 铜针计划",
            enTitle: "NEEDLES",
            date: "1963.05.10",
            type: "HISTORY",
            desc: "【历史档案】冷战时期，美军为了在核战切断海底电缆后保持通讯，向轨道散布了 4.8 亿根微型铜偶极子天线（铜针）。虽然大部分已再入大气层，但部分铜针因结块未能按计划离轨，至今仍形成微小的雷达反射杂波，对精密科学观测构成干扰。",
            img: "https://placehold.co/600x400/663300/FFF?text=Needles"
        },
        {
            title: "地空链路完全中断",
            enTitle: "SIGNAL LOST",
            date: "2026.03.20",
            type: "INCIDENT",
            desc: "由于中轨道频谱资源拥堵以及电离层闪烁效应，X 波段下行链路信号丢失。地面站连续发送 15 次握手请求均未收到应答（ACK）。卫星进入自动寻星模式，尝试切换至备用全向天线并降低传输速率以重建连接。",
            img: "https://placehold.co/600x400/000000/FFF?text=Signal"
        },
        {
            title: "多层隔热材料剥落",
            enTitle: "THERMAL",
            date: "2026.04.05",
            type: "INCIDENT",
            desc: "视觉监视相机显示，卫星背阳面的多层隔热组件（MLI）因长期热循环应力发生大面积剥落。该区域暴露在深空极寒环境中，导致临近的推进剂管路温度降至冰点以下。加热器已全功率运行，电池电量正在快速消耗。",
            img: "https://placehold.co/600x400/996600/FFF?text=Heat"
        }
    ],

    // ==============================
    // 轨道 4: HEO (2000 km) - 危险地带
    // ==============================
    2000: [
        {
            title: "高能电子暴充电效应",
            enTitle: "STORM",
            date: "2026.07.22",
            type: "INCIDENT",
            desc: "遭遇由日冕物质抛射（CME）引发的磁层亚暴。相对论性电子通量在数分钟内增加了 1000 倍，导致卫星表面绝缘材料积累了数千伏的静电位。若不进行放电处理，可能发生严重的静电放电（ESD）击穿太阳能电池片或烧毁敏感电子元件。",
            img: "https://placehold.co/600x400/990000/FFF?text=Storm"
        },
        {
            title: "BLITS 卫星碰撞事件",
            enTitle: "BLITZ",
            date: "2013.01.22",
            type: "HISTORY",
            desc: "【历史档案】俄罗斯精密激光测距卫星 BLITS 突然发生轨道参数突变和自旋异常。后续分析证实，它被一块来自 2007 年风云一号解体事件的微小碎片击中。虽然卫星本身仅重 7.5kg，但极高的相对速度（约 10km/s）足以将其撞断并使其失效。",
            img: "https://placehold.co/600x400/000066/FFF?text=Blitz"
        },
        {
            title: "南大西洋异常区穿越",
            enTitle: "SAA ZONE",
            date: "2026.11.11",
            type: "INCIDENT",
            desc: "卫星正穿越著名的“南大西洋异常区”（SAA），此处地球磁场最弱，范艾伦辐射带高度最低。辐射剂量率达到峰值，CCD 传感器画面布满噪点雪花。为了防止闩锁效应（Latch-up），主要处理单元已按预定程序断电休眠，等待穿越完成。",
            img: "https://placehold.co/600x400/000099/FFF?text=SAA"
        },
        {
            title: "变轨引擎阀门冻结",
            enTitle: "ENGINE",
            date: "2026.08.18",
            type: "INCIDENT",
            desc: "准备执行远地点抬升点火时，氧化剂阀门未能打开。遥测数据显示阀体温度过低，疑似因之前的热控故障导致推进剂冻结堵塞管道。任务控制中心正在尝试执行“热浸”程序，利用姿态调整让太阳直射发动机喷管进行解冻。",
            img: "https://placehold.co/600x400/000066/FFF?text=Engine"
        },
        {
            title: "探险者1号发现辐射带",
            enTitle: "EXPLORER",
            date: "1958.02.01",
            type: "HISTORY",
            desc: "【历史档案】美国第一颗人造卫星 Explorer 1 发射升空。其携带的盖革计数器在飞越 2000km 高度时读数突然归零（实为过载）。詹姆斯·范·艾伦据此推断出地球周围存在高能带电粒子捕获区，这一发现后来被命名为“范艾伦辐射带”。",
            img: "https://placehold.co/600x400/330000/FFF?text=Explorer"
        }
    ],

    // ==============================
    // 轨道 5: MEO+ (10000 km) - 导航中轨
    // ==============================
    10000: [
        {
            title: "深空日食低温警报",
            enTitle: "FREEZING",
            date: "2026.12.25",
            type: "INCIDENT",
            desc: "卫星进入长达 72 分钟的地球阴影区（Eclipse Season）。由于缺乏太阳辐射，整体温度急剧下降。锂离子电池组温度已逼近 -10°C 的放电下限。电源管理单元（PMU）已切断所有非必要载荷供电，全力为电池加热片供能以防止冻坏。",
            img: "https://placehold.co/600x400/0000CC/FFF?text=Cold"
        },
        {
            title: "O3b 星座互联网革命",
            enTitle: "O3B",
            date: "2014.09.01",
            type: "HISTORY",
            desc: "【历史档案】O3b（Other 3 Billion）星座正式投入商业运营。它选择 8000km 的中地球轨道，旨在平衡信号覆盖范围和传输延迟，为赤道附近“另外30亿”未联网人口提供光纤级的高速互联网接入，开启了中轨宽带通信时代。",
            img: "https://placehold.co/600x400/333333/FFF?text=O3b"
        },
        {
            title: "内部深层电介质放电",
            enTitle: "DISCHARGE",
            date: "2027.02.20",
            type: "INCIDENT",
            desc: "警报！电路板内部发生深层电介质放电（Deep Dielectric Discharge）。高能电子长期沉积在绝缘层内部，突然释放出微小脉冲，导致遥测数据总线出现乱码，两个冗余存储模块的数据校验和不一致，正在执行内存清洗程序。",
            img: "https://placehold.co/600x400/FFFF00/333?text=Static"
        },
        {
            title: "L波段导航信号干扰",
            enTitle: "JAMMING",
            date: "2027.03.10",
            type: "INCIDENT",
            desc: "频谱监测仪侦测到针对 L1/L5 导航频段的强力宽带干扰信号，来源不明。接收机载噪比（C/N0）下降了 15dB，导致难以锁定 GPS 信号进行定轨。导航解算误差扩大至 300 米，已无法维持高精度授时服务。",
            img: "https://placehold.co/600x400/660000/FFF?text=Jamming"
        },
        {
            title: "氦气增压系统微泄露",
            enTitle: "LEAK",
            date: "2027.04.05",
            type: "INCIDENT",
            desc: "推进系统高压氦气罐压力读数出现非线性下降趋势，估算泄露率为 0.05 bar/hour。虽然短期内不影响姿态控制，但长期可能导致燃料箱无法维持足够压力，从而缩短卫星的使用寿命。工程团队正在评估提前退役的可能性。",
            img: "https://placehold.co/600x400/CC6600/FFF?text=Leak"
        }
    ],
    
    // ==============================
    // 轨道 6: GPS (20200 km) - 全球定位系统
    // ==============================
    20200: [
        {
            title: "铷原子钟频率漂移",
            enTitle: "CLOCK ERR",
            date: "2027.05.01",
            type: "INCIDENT",
            desc: "主铷原子钟（RAFS）出现非预期的频率漂移，每小时误差累积达到 2 纳秒。这对纳秒级精度的导航系统是不可接受的。系统正在执行紧急切换程序，将授时基准转移至备用的氢微波激射器（Hydrogen Maser）原子钟。",
            img: "https://placehold.co/600x400/003366/FFF?text=Clock"
        },
        {
            title: "GPS SVN-23 飞轮故障",
            enTitle: "GPS FAIL",
            date: "2004.01.01",
            type: "HISTORY",
            desc: "【历史档案】GPS 卫星 SVN-23 因反作用飞轮机械故障导致姿态失控。由于无法维持对地定向天线指向，且太阳能板无法对准太阳，该卫星最终因电力耗尽而退役。这一事件促使后续 GPS Block IIR 卫星改进了姿态控制系统的冗余设计。",
            img: "https://placehold.co/600x400/003366/FFF?text=GPS"
        },
        {
            title: "伽利略卫星时钟危机",
            enTitle: "GALILEO",
            date: "2017.01.18",
            type: "HISTORY",
            desc: "【历史档案】欧洲航天局（ESA）确认 Galileo 导航系统中多颗卫星的原子钟发生故障。尽管每颗卫星配备了四台原子钟互为备份，但短时间内如此高比例的故障引发了对系统可靠性的严重担忧，促使工程师对剩馀时钟的运行策略进行了全面修改。",
            img: "https://placehold.co/600x400/333333/FFF?text=Galileo"
        },
        {
            title: "导航历书注入错误",
            enTitle: "DATA ERR",
            date: "2027.06.15",
            type: "INCIDENT",
            desc: "从地面上行注入的最新导航历书数据包未能通过循环冗余校验（CRC）。疑似上行链路遭遇电离层闪烁干扰导致比特错误。星载软件拒绝更新历书，目前卫星正在广播旧版星历数据，可能会导致用户端的定位精度略微下降。",
            img: "https://placehold.co/600x400/999999/FFF?text=Data"
        },
        {
            title: "太阳光压姿态扰动",
            enTitle: "ATTITUDE",
            date: "2027.07.20",
            type: "INCIDENT",
            desc: "由于太阳活动加剧，太阳风动压显著增强。巨大的太阳能帆板受到了超出预期的太阳光压扭矩，导致卫星偏航角（Yaw）超出 0.5 度死区。反作用飞轮已加速至饱和转速以抵抗扰动，急需启动磁力矩器进行卸载。",
            img: "https://placehold.co/600x400/660033/FFF?text=Attitude"
        }
    ],

    // ==============================
    // 轨道 7: GTO (30000 km) - 转移轨道
    // ==============================
    30000: [
        {
            title: "光伏电池辐射衰减",
            enTitle: "DAMAGE",
            date: "2027.10.05",
            type: "INCIDENT",
            desc: "由于 GTO 轨道需反复穿越地球辐射带，太阳能电池阵列遭受了剧烈的质子轰击。I-V 曲线测试显示，电池阵列的输出功率衰减速度比预期快 20%。如果趋势持续，卫星可能无法在寿命末期维持所有科学载荷的运行。",
            img: "https://placehold.co/600x400/990033/FFF?text=Damage"
        },
        {
            title: "Ariane 5 上面级滞留",
            enTitle: "ARIANE",
            date: "2023.04.14",
            type: "HISTORY",
            desc: "【历史档案】执行 JUICE 探测器发射任务的 Ariane 5 火箭上面级被遗留在 GTO 轨道。由于其巨大的体积和反复穿越繁忙轨道区域的特性，这个数吨重的金属空壳成为了轨道交通的一大隐患，也是地面雷达重点监控的目标。",
            img: "https://placehold.co/600x400/990033/FFF?text=Ariane"
        },
        {
            title: "闪电轨道意外再入",
            enTitle: "MOLNIYA",
            date: "1974.07.08",
            type: "HISTORY",
            desc: "【历史档案】一颗苏联 Molniya 通信卫星因日月引力摄动导致近地点高度逐渐降低。这颗原本运行在高椭圆轨道上的卫星意外再入大气层，巨大的碎片未完全烧毁，散落在太平洋海域。这展示了高椭圆轨道长期演化的不可预测性。",
            img: "https://placehold.co/600x400/CC3300/FFF?text=Molniya"
        },
        {
            title: "远地点重力梯度力矩",
            enTitle: "GRAVITY",
            date: "2027.12.24",
            type: "INCIDENT",
            desc: "卫星处于细长构型展开状态。在接近远地点时，地球引力在卫星两端产生的微小差异形成了重力梯度力矩，导致卫星发生缓慢的俯仰轴震荡。姿态控制系统正在消耗额外的推进剂进行微调，以保持对地通讯天线的指向。",
            img: "https://placehold.co/600x400/000066/FFF?text=Gravity"
        },
        {
            title: "燃料储箱液体晃动",
            enTitle: "SLOSHING",
            date: "2028.01.15",
            type: "INCIDENT",
            desc: "在执行姿态机动后，储箱内剩余的液态燃料在微重力环境下发生剧烈晃动（Sloshing）。流体撞击罐壁产生的干扰力矩耦合到了主星体，导致控制系统出现震荡。必须等待流体阻尼器耗散能量后才能进行下一步操作。",
            img: "https://placehold.co/600x400/006699/FFF?text=Slosh"
        }
    ],

    // ==============================
    // 轨道 8: GEO (35786 km) - 地球静止轨道
    // ==============================
    35786: [
        {
            title: "Galaxy 15 僵尸漂移",
            enTitle: "ZOMBIE",
            date: "2010.04.05",
            type: "HISTORY",
            desc: "【历史档案】Intelsat 的 Galaxy 15 卫星因固件故障失去姿态控制，但其通信转发器仍在全功率工作。它像一个失控的信号干扰源（“僵尸卫星”），沿着静止轨道漂移，沿途迫使多颗其他卫星进行紧急频率调整或变轨避让。",
            img: "https://placehold.co/600x400/000000/FFF?text=Zombie"
        },
        {
            title: "春分日凌通信中断",
            enTitle: "SUN OUT",
            date: "2028.03.21",
            type: "INCIDENT",
            desc: "正值春分时节，卫星、地球与太阳处于一条直线上。地面站天线在对准卫星的同时也对准了太阳，强大的宽带太阳射电噪声淹没了微弱的卫星信号。通信链路中断预计将持续 10 分钟，这是静止轨道卫星不可避免的自然现象。",
            img: "https://placehold.co/600x400/FFCC00/333?text=Sun"
        },
        {
            title: "Syncom 3 奥运直播",
            enTitle: "SYNCOM",
            date: "1964.08.19",
            type: "HISTORY",
            desc: "【历史档案】Syncom 3 发射成功，成为世界上第一颗真正进入地球静止轨道（GEO）的卫星。它历史性地跨越太平洋，将 1964 年东京奥运会的电视信号实时传输到了美国，标志着全球卫星电视直播时代的开启。",
            img: "https://placehold.co/600x400/FFCC00/333?text=Syncom"
        },
        {
            title: "高压总线电弧击穿",
            enTitle: "ARCING",
            date: "2028.06.30",
            type: "INCIDENT",
            desc: "太阳能帆板驱动机构（SADA）附近的电缆绝缘层因老化开裂，在 100V 高压母线和卫星结构地之间诱发了真空中电弧放电。过流保护电路瞬间切断了 B 母线供电，导致一半的转发器关机。主控中心正在评估绝缘受损程度。",
            img: "https://placehold.co/600x400/FFFF33/333?text=Arc"
        },
        {
            title: "墓地轨道碎片下沉",
            enTitle: "DRIFT",
            date: "2028.03.10",
            type: "INCIDENT",
            desc: "警报！一颗位于 GEO 上方 300km “墓地轨道”的废弃卫星，因受到太阳光压累积摄动，其轨道偏心率增加，近地点已危险地切入静止轨道保护区。碰撞预警系统显示其将在 24 小时内以 5km 的距离飞掠本星，需密切监视。",
            img: "https://placehold.co/600x400/333333/FFF?text=Graveyard"
        }
    ]
};