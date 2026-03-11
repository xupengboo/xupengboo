---
title: Linux 基础
outline: deep
---

# Linux 基础

## 一、文件目录工作机制

### 目录结构

Linux 系统目录结构为**树形结构**，根目录是 `/`，所有文件和目录都挂载在这棵树上。

:::warning 注意
有标 ⭐ 的目录是系统核心目录，**不要随意删除或修改其内部文件**，否则可能导致系统无法正常运行。
:::

| 目录 | 说明 |
|---|---|
| `/bin` ⭐ | Binary 的缩写，存放**系统最常用的命令**，如 `ls`、`cp`、`mv` 等 |
| `/boot` | 存放**启动 Linux 时的核心文件**，包括引导文件和镜像文件 |
| `/dev` | Device 的缩写，存放 Linux 的**外部设备**，在 Linux 中访问设备和访问文件的方式相同 |
| `/etc` ⭐ | 存放所有**系统管理所需的配置文件和子目录**，如网络配置、用户配置等 |
| `/home` | **用户主目录**，每个用户都有一个以账号名命名的目录，如 `/home/alice` |
| `/lib` | 存放系统最基本的**动态链接共享库**，类似 Windows 的 DLL，几乎所有应用程序都需要用到 |
| `/lost+found` | 一般情况下为空，系统**非法关机后会在此存放孤立文件** |
| `/media` | Linux 自动识别的**可移除设备挂载目录**，如 U 盘、光驱识别后会挂载到此 |
| `/mnt` | 提供给用户**临时挂载其他文件系统**的目录，如挂载光驱到 `/mnt` 后可访问其内容 |
| `/opt` | 给**主机额外安装软件**的目录，如安装 Oracle 数据库可放在此处，默认为空 |
| `/proc` | 虚拟目录，是**系统内存的映射**，可直接通过访问此目录获取系统信息（进程、内存等） |
| `/root` ⭐ | **系统管理员（root）的主目录**，与普通用户的 `/home/xxx` 地位相同 |
| `/sbin` ⭐ | Super User Binary，存放**系统管理员使用的系统管理程序**，如 `reboot`、`fdisk` 等 |
| `/selinux` | RedHat/CentOS 特有目录，是一个**安全机制**，类似 Windows 防火墙，相关文件存放于此 |
| `/srv` | 存放一些**服务启动后需要提取的数据** |
| `/sys` | Linux 2.6 内核引入，挂载了 `sysfs` 虚拟文件系统，整合了内核信息、设备信息等，是内核设备模型的直观反映 |
| `/tmp` | 存放**临时文件**，系统重启后通常会清空 |
| `/usr` | 非常重要的目录，**用户的应用程序和文件大多存放在此**，类似 Windows 的 `Program Files` |
| `/usr/bin` ⭐ | **系统用户使用的应用程序**（非系统管理员专用） |
| `/usr/sbin` ⭐ | **超级用户使用的高级管理程序**和系统守护进程 |
| `/usr/src` | **内核源代码默认存放目录** |
| `/var` ⭐ | 存放**不断扩充且经常被修改的文件**，如各种日志文件（`/var/log`） |

**常用目录速记：**

```
/etc          → 所有配置文件
/home         → 普通用户的主目录
/var/log      → 各种日志文件
/tmp          → 临时文件（可随意读写）
/usr/bin      → 用户级命令（如 git、python）
/usr/local    → 手动安装的软件默认路径
```

### 文件类型

通过 `ls -l` 可以看到文件的详细信息，第一个字符表示文件类型：

| 标识 | 类型 |
|---|---|
| `d` | 目录 |
| `-` | 普通文件 |
| `l` | 链接文件（软链接） |
| `b` | 块设备文件（可随机存取，如磁盘） |
| `c` | 字符设备文件（顺序读取，如键盘、鼠标） |

### 属主与属组

Linux 按**文件拥有者（属主）**、**属主同组用户（属组）**、**其他用户**三个维度控制文件访问权限。

```shell
$ ls -l
dr-xr-xr-x  2 root root 4096 Dec 14 2012 bin
```

以上示例：`bin` 是目录，属主和属组均为 `root`。属主有读/写/执行权限，属组和其他用户有读/执行权限。

![属主与属组](/public/images/image-20250217188880001.png)

---

## 二、文件目录管理

> 关键命令：`cd` `ls` `pwd` `mkdir` `rmdir` `tree` `touch` `ln` `rename` `stat` `file` `chmod` `chown` `locate` `find` `cp` `scp` `mv` `rm`

### 目录操作

#### cd — 切换目录

```shell
cd          # 切换到用户主目录
cd ~        # 切换到用户主目录
cd -        # 切换到上一个工作目录
cd ./       # 当前目录
cd ..       # 切换到上级目录
cd ../..    # 切换到上两级目录
```

#### ls — 列出目录内容

```shell
ls          # 列出当前目录可见文件
ls -l       # 详细信息
ls -la      # 包含隐藏文件的详细信息
ls -lh      # 详细信息，文件大小以可读单位显示
ls -lt      # 按时间排序
ls -ltr     # 按修改时间反向排序
ls --color=auto  # 按类型标记颜色
```

#### pwd — 显示当前路径

```shell
pwd         # 显示当前目录的绝对路径
```

#### mkdir — 创建目录

```shell
# 递归创建多级目录
mkdir -p zp/test

# 创建目录并设置权限（属主 rwx，属组 r-x，其他 ---）
mkdir -p -m 750 zp/test
```

#### rmdir — 删除空目录

```shell
# 删除 test 及其父目录 zp（仅当为空目录时）
rmdir -p zp/test
```

#### tree — 树状显示目录结构（需安装）

```shell
# 只显示 /private 第一层
tree /private -L 1

# 忽略 node_modules 目录
tree -I node_modules

# 显示 node_modules 两层结构
tree -P node_modules -L 2

# 忽略多个目录
tree -I 'node_modules|icon|font' -L 2

# 将结果输出到文件
tree -L 2 > /home/www/tree.txt
```

---

### 文件操作

#### touch — 创建空文件 / 更新时间戳

```shell
touch newfile.txt       # 创建空文件
touch existfile.txt     # 更新已有文件的时间戳
```

#### ln — 创建链接

```shell
ln source target        # 创建硬链接（默认）
ln -s source target     # 创建软链接（符号链接）
```

:::tip 硬链接 vs 软链接
- **硬链接**：同一文件系统内，文件的另一个名称，删除原文件不影响硬链接
- **软链接**：类似快捷方式，可跨文件系统，原文件删除后软链接失效
  :::

#### rename — 批量重命名

```shell
rename "s/AA/aa/" *           # 将文件名中的 AA 替换为 aa
rename "s/.html/.php/" *      # 将 .html 后缀改为 .php
rename "s/$/.txt/" *          # 所有文件名加上 .txt 后缀
rename "s/.txt//" *           # 去掉所有 .txt 后缀
```

#### stat — 查看文件详细状态

```shell
stat filename       # 显示文件的详细状态信息（比 ls -l 更详细）
```

#### file — 探测文件类型

```shell
file install.log          # 显示文件类型
file -b install.log       # 不显示文件名
file -i install.log       # 显示 MIME 类型
file -L /var/spool/mail   # 显示符号链接指向文件的类型
```

#### chmod — 修改文件权限

权限值对应关系：`r=4`、`w=2`、`x=1`

```shell
# 权限结构示意
#  -rw-r--r--   1 user  staff   651 Oct 12 12:53 .gitconfig
#  ↑╰┬╯╰┬╯╰┬╯
#  ┆ ┆  ┆  ╰── 其他人（o）
#  ┆ ┆  ╰───── 属组（g）
#  ┆ ╰──────── 属主（u）
#  ╰─────────── 文件类型（d=目录，-=文件）

# 分别设置属主、属组、其他人的权限
chmod u=rwx,g=rw,o=r file01

# 对所有人添加可执行权限
chmod a+x file01

# 递归修改目录下所有文件权限
chmod -R 755 /home/wwwroot/*

# 数字模式：属主 rwx=7，属组 r-x=5，其他 r-x=5
chmod 755 file01

# 常用权限组合
# 755：目录或可执行文件（属主全权，其他只读执行）
# 644：普通文件（属主读写，其他只读）
# 777：所有人全权（慎用）
```

#### chown — 修改文件所有者

```shell
# 递归将目录及其下所有文件的属主改为 liu
chown -R liu /usr/meng

# 同时修改属主和属组（UID:GID）
sudo chown -R 1000:1000 /data/jenkins
```

:::tip
Linux 系统上第一个非 root 用户的默认 UID 通常为 `1000`。通过非 root 用户启动的 Docker 容器，有时需要对挂载卷目录执行此操作。
:::

#### locate / updatedb — 快速查找文件

```shell
locate pwd          # 查找所有与 pwd 相关的文件
locate /etc/sh      # 查找 /etc 下所有以 sh 开头的文件

updatedb            # 手动更新数据库（locate 依赖此数据库）
```

:::warning
`locate` 搜索的是数据库（每天自动更新一次），**无法查到最新变动的文件**。如需查找刚创建的文件，先执行 `updatedb` 再搜索。
:::

#### find — 实时搜索文件

```shell
# 列出当前目录及子目录下所有文件
find .

# 在 /home 下查找 .txt 文件（忽略大小写用 -iname）
find /home -name "*.txt"
find /home -iname "*.txt"

# 查找多种类型文件
find . -name "*.txt" -o -name "*.pdf"

# 路径模糊匹配
find /usr/ -path "*local*"

# 正则匹配文件路径
find . -regex ".*\(\.txt\|\.pdf\)$"

# 排除特定文件
find /home ! -name "*.txt"

# 在文件内容中搜索字符串
find . -type f -name "*" | xargs grep "搜索关键词"
```

#### which / whereis — 查找命令路径

```shell
which python3       # 查找命令的可执行文件路径
whereis python3     # 查找命令的程序、源码、手册等相关文件
```

:::tip
`which` 和 `whereis` 只在 `$PATH` 环境变量指定的目录中查找。在 `/etc/profile` 中常见 `:$PATH`，表示在原有 PATH 基础上追加新路径（类似 Windows 用 `;` 分隔 PATH）。
:::

---

### 文件与目录通用操作

#### cp — 复制

```shell
# 复制文件并重命名
cp file /usr/men/tmp/file1

# 递归复制目录（-r 必须加）
cp -r /usr/men /usr/zh

# 强制覆盖复制
cp -rf /usr/men/* /usr/zh

# 复制匹配文件（-i 覆盖前提示）
cp -i /usr/men/m*.c /usr/zh
```

#### mv — 移动 / 重命名

```shell
mv file1.txt /home/office/                       # 移动单个文件
mv file2.txt file3.txt file4.txt /home/office/   # 移动多个文件
mv *.txt /home/office/                           # 移动所有 txt 文件
mv dir1/ /home/office/                           # 移动目录

mv file1.txt file2.txt          # 重命名文件
mv dir1/ dir2/                  # 重命名目录
mv -i file1.txt /home/office    # 覆盖前提示
mv -f *.txt /home/office        # 强制覆盖
mv -bv *.txt /home/office       # 覆盖时创建备份
```

#### rm — 删除

:::warning
`rm -rf` 操作不可逆，执行前务必确认路径正确。
:::

```shell
rm test.txt               # 删除文件
rm -i test.txt test2.txt  # 交互式删除（逐个确认）
rm -r testdir             # 递归删除目录
rm -rf testdir            # 强制递归删除（无提示）
rm -v testdir             # 显示删除详情
```

#### scp — 跨服务器复制

基于 SSH 的加密传输，适合少量文件的安全传输。

```shell
# 上传文件到远程服务器
scp test.txt root@192.168.0.1:/opt

# 上传目录到远程服务器
scp -r test root@192.168.0.1:/opt

# 从远程服务器下载文件
scp root@192.168.0.1:/opt/test.txt ./
```

#### rsync — 高效文件同步

仅传输差异部分，支持断点续传，适合大量文件同步。

```shell
rsync -avz --delete /local/path user@host:/remote/path
# -a：归档模式（保留权限、时间戳等）
# -v：显示详细过程
# -z：压缩传输
# --delete：删除目标端多余文件，保持严格一致
```

---

## 三、文件内容查看与编辑

> 关键命令：`cat` `head` `tail` `more` `less` `sed` `vi` `grep`

#### cat — 查看 / 合并文件

```shell
cat file              # 显示文件内容
cat file1 file2       # 同时显示两个文件内容
cat file1 file2 > out # 合并两个文件输出到 out
```

#### head — 查看文件开头

```shell
head file             # 默认显示前 10 行
head -n 20 file       # 显示前 20 行
```

#### tail — 查看文件末尾

```shell
tail file             # 默认显示最后 10 行
tail -n 20 file       # 显示最后 20 行
tail -n +20 file      # 从第 20 行起显示到末尾
tail -c 10 file       # 显示最后 10 个字符
tail -f ./app.log     # 实时监听文件新增内容（常用于查看日志）
```

:::tip tail -f 注意事项
`tail -f` 只能监听通过**追加写入**（`>>`）方式更新的文件，vim 编辑保存会导致监听中断。

```shell
echo "新内容" >> app.log   # ✅ tail -f 可以监听到
echo "新内容" > app.log    # ❌ 覆盖写入，tail -f 会中断
```
:::

#### more — 分页查看（只能向前翻页）

```shell
more file             # 分页显示文件
more -dc file         # 先清屏再显示，底部显示百分比
more -c -10 file      # 每 10 行一页，先清屏
```

常用快捷键：`Space` 下一页、`Enter` 下一行、`B` 上一页、`Q` 退出

#### less — 分页查看（可前后翻页，推荐）

比 `more` 更强大，支持 `PageUp`/`PageDown` 双向翻页，`Q` 退出。

#### sed — 流编辑器

```shell
# 替换每行第一个匹配
sed 's/book/books/' file

# 全局替换（加 g 标记）
sed 's/book/books/g' file

# 直接修改原文件
sed -i 's/book/books/g' file

# 只打印发生替换的行
sed -n 's/test/TEST/p' file

# 删除空白行
sed '/^$/d' file

# 删除第 2 行
sed '2d' file

# 删除第 2 行到末尾
sed '2,$d' file

# 多命令替换（常用于模板文件变量替换）
sed -e 's#{IMAGE_URL}#registry.example.com/myapp#g; s#{IMAGE_TAG}#v1.0.0#g' template.yaml > output.yaml
```

#### vi / vim — 文本编辑器

vim 是 vi 的增强版，Linux 下最常用的命令行编辑器。

#### grep — 文本搜索

```shell
# 在文件中搜索
grep "keyword" file

# 递归搜索目录下所有文件，显示行号
grep "class" . -R -n

# 忽略大小写
grep -i "HELLO" file

# 多模式匹配
grep -e "class" -e "virtual" file

# 只在特定类型文件中搜索
grep "main()" . -r --include "*.{php,html}"

# 排除特定文件
grep "main()" . -r --exclude "README"
```

---

## 四、文件压缩与解压

> 关键命令：`tar` `gzip` `zip` `unzip`

#### tar — 打包 / 压缩 / 解压

```shell
# 仅打包，不压缩
tar -cvf archive.tar file.txt

# 打包 + gzip 压缩（最常用）
tar -zcvf archive.tar.gz file.txt

# 打包 + bzip2 压缩（压缩率更高，速度更慢）
tar -jcvf archive.tar.bz2 file.txt

# 查看压缩包内容
tar -ztvf archive.tar.gz

# 解压到当前目录
tar -zxvf archive.tar.gz

# 解压到指定目录
tar -zxvf archive.tar.gz -C /target/dir

# 只解压部分文件
tar -zxvf archive.tar.gz specific-file.log
```

| 参数 | 含义 |
|---|---|
| `-c` | 创建压缩包 |
| `-x` | 解压 |
| `-v` | 显示过程 |
| `-f` | 指定文件名（必须放最后） |
| `-z` | 使用 gzip（对应 `.tar.gz`） |
| `-j` | 使用 bzip2（对应 `.tar.bz2`） |
| `-t` | 查看压缩包内容 |

#### gzip — 压缩 / 解压单个文件

```shell
gzip file           # 压缩文件（原文件被替换为 .gz）
gzip -d file.gz     # 解压
gzip -l file.gz     # 查看压缩信息
gzip -rv test/      # 递归压缩目录
gzip -dr test/      # 递归解压目录
```

#### zip / unzip

```shell
# 压缩整个目录
zip -q -r html.zip /home/Blinux/html

# 解压到当前目录
unzip test.zip

# 解压到指定目录
unzip -n test.zip -d /tmp/      # 不覆盖已有文件
unzip -o test.zip -d /tmp/      # 覆盖已有文件

# 只查看内容，不解压
unzip -v test.zip
```

---

## 五、硬件管理

> 关键命令：`df` `du` `top` `free` `iotop`

#### df — 查看磁盘空间

```shell
df              # 查看所有磁盘分区使用情况（默认 KB）
df -h           # 以可读单位显示（推荐）
df -a           # 显示所有文件系统（包括虚拟的）
```

#### du — 查看目录/文件占用空间

```shell
du              # 显示当前目录下各子目录占用空间
du -s           # 只显示总大小
du -sh *        # 以可读单位显示当前目录下每个文件/目录的大小
du -sh /var/log # 查看指定目录总大小
```

#### top — 系统实时监控（任务管理器）

```shell
top             # 启动实时监控
```

进入 top 后的常用操作：

| 按键 | 功能 |
|---|---|
| `P` | 按 CPU 使用率排序 |
| `M` | 按内存使用率排序 |
| `k` | 杀死进程（输入 PID） |
| `q` | 退出 |

#### free — 查看内存使用

```shell
free -h             # 以可读单位显示内存使用情况
free -m             # 以 MB 为单位显示
free -s 5           # 每 5 秒刷新一次
```

#### iotop — 磁盘 I/O 监控（需安装）

```shell
# 安装
yum install iotop     # CentOS
apt install iotop     # Ubuntu

iotop               # 实时显示各进程的磁盘 I/O 使用情况
```

---

## 六、网络管理

> 关键命令：`curl` `wget` `telnet` `ip` `hostname` `ifconfig` `route` `ssh` `ssh-keygen` `firewalld` `iptables` `ping` `traceroute` `netstat`

#### curl — HTTP 请求工具

```shell
# GET 请求
curl https://api.example.com/data

# POST JSON 数据
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "John"}' https://api.example.com/users

# 携带 Token
curl -H "Authorization: Bearer <token>" https://api.example.com/data

# 下载文件
curl -O https://example.com/file.zip          # 保持原文件名
curl -o myfile.zip https://example.com/file.zip  # 自定义文件名

# 跟随重定向
curl -L https://example.com/redirect

# 只看响应头
curl -I https://example.com

# 调试模式（显示完整通信过程）
curl -v https://example.com

# 设置超时
curl --max-time 10 https://example.com

# 设置代理
curl -x http://proxy.example.com:8080 https://example.com
```

#### wget — 文件下载

```shell
wget https://example.com/file.zip             # 下载文件
wget -O output.zip https://example.com/file   # 指定保存文件名
wget -c https://example.com/bigfile.zip       # 断点续传
wget -r https://example.com/                  # 递归下载整个网站
```

#### telnet — 测试端口连通性

```shell
telnet 192.168.1.100 22     # 测试目标主机 22 端口是否可达
```

#### ip — 网络配置

```shell
ip link show                            # 查看网络接口
ip link set eth0 up                     # 开启网卡
ip link set eth0 down                   # 关闭网卡
ip addr show                            # 查看 IP 信息
ip addr add 192.168.0.1/24 dev eth0    # 添加 IP
ip addr del 192.168.0.1/24 dev eth0    # 删除 IP
ip route show                           # 查看路由表
ip route add default via 192.168.1.254  # 设置默认路由
```

#### ssh — 远程登录

```shell
ssh user@192.168.1.100          # 连接远程服务器
ssh -p 2222 root@192.168.1.100  # 指定端口
```

#### ssh-keygen — 生成 SSH 密钥

```shell
ssh-keygen -t rsa -b 4096       # 生成 RSA 4096 位密钥对
```

#### ping — 测试网络连通性

```shell
ping 192.168.1.1        # 持续 ping
ping -c 4 192.168.1.1   # 只 ping 4 次
```

#### traceroute — 追踪网络路由（需安装）

```shell
traceroute www.example.com   # 追踪数据包到目标的完整路径
```

#### netstat — 查看网络状态

```shell
netstat -a          # 列出所有端口
netstat -at         # 只列 TCP 端口
netstat -au         # 只列 UDP 端口
netstat -l          # 只显示监听中的端口
netstat -lt         # 监听中的 TCP 端口
netstat -s          # 显示各协议统计信息
netstat -st         # TCP 统计
netstat -su         # UDP 统计
```

#### firewalld — 防火墙管理

```shell
# 服务管理
systemctl start firewalld
systemctl stop firewalld
systemctl status firewalld
systemctl enable firewalld    # 开机自启
systemctl disable firewalld   # 禁止开机自启

# 端口管理（常用）
firewall-cmd --zone=public --add-port=80/tcp --permanent    # 开放端口（永久）
firewall-cmd --reload                                        # 重新载入规则
firewall-cmd --zone=public --query-port=80/tcp              # 查询端口
firewall-cmd --zone=public --remove-port=80/tcp --permanent # 关闭端口

# 查看状态
firewall-cmd --state
firewall-cmd --zone=public --list-ports
```

#### iptables — 底层防火墙

```shell
# 开放常用端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # HTTP
iptables -A INPUT -p tcp --dport 443 -j ACCEPT   # HTTPS

# 屏蔽 IP
iptables -I INPUT -s 123.45.6.7 -j DROP          # 屏蔽单个 IP
iptables -I INPUT -s 123.0.0.0/8 -j DROP         # 屏蔽整个 IP 段

# 查看规则
iptables -L -n -v
```

---

## 七、用户管理

> 关键命令：`groupadd` `groupdel` `groupmod` `useradd` `userdel` `usermod` `passwd` `su` `sudo`

#### groupadd — 创建用户组

```shell
groupadd devteam              # 创建用户组
groupadd -g 1001 devteam      # 创建并指定 GID（建议 > 1000）
```

相关文件：`/etc/group`（组账户信息）、`/etc/gshadow`（安全组信息）

#### groupdel — 删除用户组

```shell
groupdel devteam   # 删除用户组（需先移除组内所有用户）
```

#### groupmod — 修改用户组

```shell
# 修改组 ID 和组名
groupmod -g 1002 -n newname devteam
```

#### useradd — 创建用户

```shell
useradd username                        # 创建用户（自动创建同名组和主目录）
useradd -g devteam -u 1001 username     # 指定主组和 UID
useradd -d /opt/username username       # 指定主目录
useradd -G devteam,docker username      # 加入多个附加组
```

:::tip
- 不指定主目录，默认在 `/home/用户名` 下创建
- 不指定组，默认创建同名组
- 创建用户后需执行 `passwd username` 设置密码
  :::

#### userdel — 删除用户

```shell
userdel username        # 只删除账号，保留主目录
userdel -r username     # 同时删除主目录和相关文件
```

#### usermod — 修改用户信息

```shell
usermod -d /new/home username       # 修改主目录
usermod -u 1002 username            # 修改 UID
usermod -g newgroup username        # 修改主组
usermod -G docker,devteam username  # 修改附加组
usermod -L username                 # 锁定账号
```

#### passwd — 设置密码

```shell
passwd username         # 为指定用户设置密码（需 root）
passwd                  # 修改当前用户密码
passwd -l username      # 锁定用户，禁止登录
passwd -d username      # 清除密码（无密码可登录，慎用）
passwd -S username      # 查看密码状态
```

#### su — 切换用户

```shell
su username             # 切换到指定用户
su -                    # 切换到 root
exit                    # 退出当前用户，返回上一个
```

#### sudo — 以 root 权限执行

```shell
sudo command            # 以 root 权限执行命令
sudo -u userb ls -l     # 以指定用户身份执行
sudo -l                 # 查看当前用户的 sudo 权限
```

**给普通用户授予 sudo 权限：**

```shell
# 1. 给 /etc/sudoers 添加写权限
chmod u+w /etc/sudoers

# 2. 添加授权行
echo "username ALL=(ALL) ALL" >> /etc/sudoers
# 免密码版本：
echo "username ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# 3. 恢复默认权限
chmod u-w /etc/sudoers
```

---

## 八、系统管理

> 关键命令：`reboot` `shutdown` `date` `mount` `umount` `ps` `kill` `service` `systemctl` `crontab`

#### reboot / shutdown — 重启与关机

```shell
reboot                              # 重启
shutdown -h now                     # 立即关机
shutdown -r now                     # 立即重启
shutdown -h +5 "即将关机，请保存工作"  # 5 分钟后关机并广播消息
```

#### date — 日期时间

```shell
# 查看
date                            # 当前时间
date +"%Y-%m-%d %H:%M:%S"      # 格式化输出

# 加减操作
date +%Y%m%d                    # 显示今天日期
date -d "+1 day" +%Y%m%d        # 明天
date -d "-1 day" +%Y%m%d        # 昨天
date -d "+1 month" +%Y%m%d      # 下个月
date -d "-1 year" +%Y%m%d       # 去年

# 设置系统时间（需 root）
date -s "2024-01-01 12:00:00"

# 统计命令执行耗时
start=$(date +%s)
# ...执行命令...
end=$(date +%s)
echo "$((end - start)) 秒"
```

#### mount / umount — 挂载与卸载

```shell
mount /dev/sdb1 /mnt/data       # 挂载磁盘到指定目录
umount /mnt/data                 # 卸载（通过挂载点）
umount /dev/sdb1                 # 卸载（通过设备名）
```

#### ps — 查看进程

```shell
ps aux                          # 查看所有进程
ps aux | grep nginx             # 过滤特定进程
ps aux | sort -rnk 4            # 按内存使用率排序
ps aux | sort -nk 3             # 按 CPU 使用率排序
```

#### kill — 终止进程

```shell
kill PID                        # 正常终止（SIGTERM，进程可做收尾工作）
kill -9 PID                     # 强制终止（SIGKILL，立即结束）
killall nginx                   # 终止所有同名进程
```

:::tip
优先用 `kill PID`，只有进程无响应时才用 `kill -9`，强杀可能导致数据丢失。
:::

#### service — 服务管理（旧版）

```shell
service nginx start             # 启动服务
service nginx stop              # 停止服务
service nginx restart           # 重启服务
service nginx status            # 查看状态
```

#### systemctl — 服务管理（推荐）

`systemctl` 整合了 `service` 和 `chkconfig`，是现代 Linux 的标准服务管理工具。

```shell
systemctl start nginx           # 启动
systemctl stop nginx            # 停止
systemctl restart nginx         # 重启
systemctl reload nginx          # 重载配置（不中断服务）
systemctl status nginx          # 查看状态
systemctl enable nginx          # 开机自启
systemctl disable nginx         # 取消开机自启
systemctl list-units --type=service  # 查看所有服务
```

#### crontab — 定时任务

```shell
crontab -e          # 编辑当前用户的定时任务
crontab -l          # 查看当前用户的定时任务
crontab -r          # 删除当前用户的所有定时任务
```

cron 表达式格式：

```
*    *    *    *    *   命令
┆    ┆    ┆    ┆    ┆
┆    ┆    ┆    ┆    └── 星期（0-7，0和7都是周日）
┆    ┆    ┆    └─────── 月份（1-12）
┆    ┆    └──────────── 日（1-31）
┆    └───────────────── 时（0-23）
└────────────────────── 分（0-59）
```

示例：

```shell
# 每天凌晨 2 点执行备份脚本
0 2 * * * /scripts/backup.sh

# 每 5 分钟执行一次
*/5 * * * * /scripts/check.sh

# 每周一早上 8 点
0 8 * * 1 /scripts/weekly.sh
```

详细语法参考：https://www.runoob.com/linux/linux-comm-crontab.html

---

## 九、软件包管理

> 关键命令：`rpm` `yum` `apt-get`

#### rpm — RPM 包管理（CentOS/RHEL）

```shell
# 安装
rpm -ivh package.rpm          # 安装（-i 安装，-v 显示过程，-h 显示进度）

# 卸载
rpm -e package-name           # 卸载（不加 .rpm 后缀）
rpm -e --nodeps package-name  # 忽略依赖强制卸载

# 查询
rpm -qa                       # 列出所有已安装的包
rpm -qa | grep nginx          # 查找特定包
```

#### yum — 自动依赖管理（CentOS/RHEL）

```shell
yum install nginx             # 安装（自动处理依赖）
yum remove nginx              # 卸载
yum update nginx              # 更新指定包
yum update                    # 更新所有包
yum search nginx              # 搜索包
yum info nginx                # 查看包信息
yum list installed            # 列出已安装的包
```

**替换为阿里云 yum 源（解决国内下载慢）：**

```shell
cp /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all
yum makecache
```

#### apt / apt-get — 包管理（Debian/Ubuntu）

```shell
apt update                       # 更新软件包列表
apt install nginx                # 安装
apt remove nginx                 # 卸载（保留配置）
apt purge nginx                  # 卸载并删除配置
apt upgrade                      # 升级所有已安装的包
apt dist-upgrade                 # 系统版本升级
apt search nginx                 # 搜索包
apt autoremove                   # 删除不再需要的依赖包
```

---

## 十、常用进阶命令

### nohup — 后台持久运行

```shell
# 格式
nohup [命令] > output.log 2>&1 &

# 示例：后台启动 Java 服务，日志输出到 app.log
nohup java -jar app.jar > app.log 2>&1 &
```

| 符号 | 含义 |
|---|---|
| `nohup` | 不挂起，关闭终端后进程继续运行 |
| `> file` | 将标准输出重定向到文件 |
| `2>&1` | 将错误输出合并到标准输出 |
| `&` | 后台运行 |

### /dev/null — 黑洞

```shell
# 丢弃所有输出（静默执行）
command > /dev/null 2>&1
```

### set -eux — Shell 脚本严格模式

在脚本开头加上 `set -eux`，启用严格执行模式：

| 选项 | 作用 |
|---|---|
| `-e` | 任何命令失败立即退出脚本 |
| `-u` | 使用未定义变量时立即退出 |
| `-x` | 执行每条命令前打印命令内容（调试用） |

```bash
#!/bin/bash
set -eux

echo "开始部署..."
cp app.jar /opt/app/
systemctl restart app
```

### export — 设置环境变量

```shell
# 将当前目录的 bin 追加到 PATH
export PATH=$PWD/bin:$PATH

# 设置永久环境变量（写入 /etc/profile 或 ~/.bashrc）
echo 'export JAVA_HOME=/usr/local/java' >> ~/.bashrc
source ~/.bashrc
```

### nano — 简易文本编辑器

```shell
nano filename.txt     # 打开文件（不存在则新建）
```

常用快捷键：

| 快捷键 | 功能 |
|---|---|
| `Ctrl + O` | 保存文件 |
| `Ctrl + X` | 退出 |
| `Ctrl + W` | 查找 |
| `Ctrl + K` | 剪切当前行 |
| `Ctrl + U` | 粘贴 |
| `Ctrl + G` | 显示帮助 |

### jps — 查看 Java 进程（JDK 自带）

```shell
jps             # 列出所有 Java 进程的 PID 和类名
jps -m          # 同时显示传入的参数
jps -l          # 显示完整类名或 JAR 路径
```

### sh — 执行脚本

```shell
sh script.sh                                    # 执行本地脚本
curl -L https://example.com/install.sh | sh -   # 下载并直接执行远程脚本
```

:::warning
通过管道直接执行远程脚本（`curl | sh`）存在安全风险，执行前确认来源可信。
:::
