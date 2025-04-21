---
title: Linux 命令
order: 1
---


## 1. Linux 之 文件目录 工作机制

**Linux系统目录结构是树形结构，根目录是 `/`。**

![image](https://github.com/ITholmes/hello-world/assets/70437837/40c0a529-ed00-4d39-a52c-b67055bb5376)

**Linux系统有不同的文件类型：**

```shell
$ ls -l
total 64
dr-xr-xr-x 2 root root 4096 Dec 14 2012 bin
dr-xr-xr-x 4 root root 4096 Apr 19 2012 boot
```

文件类型：
- 当为 d 则是目录
- 当为 - 则是文件；
- 若是 l 则表示为链接文档(link file)；
- 若是 b 则表示为装置文件里面的可供储存的接口设备(可随机存取装置)；
- 若是 c 则表示为装置文件里面的串行端口设备，例如键盘、鼠标(一次性读取装置)。

![image](https://github.com/ITholmes/hello-world/assets/70437837/7bc82b98-1260-4706-98f1-eb37714b1920)

**Linux文件 `属主` 和 `属组`**：
- 在 Linux 系统中，用户是按组分类的，一个用户属于一个或多个组。
- 文件拥有者以外的用户又可以分为 文件拥有者的同组用户 和 其他用户 。
- 因此，Linux 系统按文件拥有者、文件拥有者同组用户和其他用户来规定了不同的文件访问权限。

例如：

```shell
$ ls -l
total 64
dr-xr-xr-x   2 root root 4096 Dec 14  2012 bin
dr-xr-xr-x   4 root root 4096 Apr 19  2012 boot
```

bin 文件是一个目录文件，属主和属组都为 root，属主有可读、可写、可执行的权限；与属主同组的其他用户有可读和可执行的权限；其他用户也有可读和可执行的权限。

## 2. Linux命令 之 文件目录管理

>  **关键词：`cd`, `ls`, `pwd`, `mkdir`, `rmdir`, `tree`, `touch`, `ln`, `rename`, `stat`, `file`, `chmod`, `chown`, `locate`, `find`, `cp`, `scp`, `mv`, `rm`。**

### 2.1 目录管理

#### 2.1.1 cd

>  cd 命令用来切换工作目录。

示例：

```shell
cd          # 切换到用户主目录
cd ~        # 切换到用户主目录
cd -        # 切换到上一个工作目录
cd ./ 		# 就是指的当前目录
cd ..       # 切换到上级目录
cd ../ 		# 切换到上级目录(与上一个一样)
cd ../..    # 切换到上两级目录
```

#### 2.1.2 ls

> ls 命令用来显示目录信息。

```shell
ls        # 列出当前目录可见文件
ls -l     # 列出当前目录可见文件详细信息
ls -la    # 列出所有文件（包括隐藏）的详细信息
ls -lh    # 列出详细信息并以可读大小显示文件大小
ls -lt    # 按时间列出文件和文件夹详细信息
ls -ltr   # 按修改时间列出文件和文件夹详细信息
ls --color=auto     # 列出文件并标记颜色分类
```

#### 2.1.3 pwd

> pwd 命令用来显示当前目录的绝对路径。

#### 2.1.4 mkdir

> mkdir 命令用来创建目录。

- -p 确保目录名称存在，不存在的就建一个。

```shell
# 在当前目录中创建 zp 和 zp 的子目录 test
mkdir -p zp/test

# 在当前目录中创建 zp 和 zp 的子目录 test；权限设置为文件主可读、写、执行，同组用户可读和执行，其他用户无权访问
mkdir -p -m 750 zp/test
```

#### 2.1.5 rmdir

> rmdir 命令用来删除空目录。

```shell
# 删除子目录 test 和其父目录 zp
rmdir -p zp/test
```

#### 2.1.6 tree(需要安装)

> tree 命令以树状显示目录的内。

示例：

```shell
# 列出目录 /private 第一级文件名
tree /private -L 1
/private/
├── etc
├── tftpboot
├── tmp
└── var

# 忽略文件夹
tree -I node_modules            # 忽略当前目录文件夹 node_modules
tree -P node_modules            # 列出当前目录文件夹 node_modules 的目录结构
tree -P node_modules -L 2       # 显示目录 node_modules 两层的目录树结构
tree -L 2 >  /home/www/tree.txt  # 当前目录结果存到 tree.txt 文件中

# 忽略多个文件夹
tree -I 'node_modules|icon|font' -L 2
```

### 2.2 文件管理

#### 2.2.1 touch

>  touch命令有两个功能：一是用来创建空文件，二是用于把已存在文件的时间标签更新为系统当前的时间（默认方式），它们的数据将原封不动地保留下来。

#### 2.2.2 ln

> ln 命令用来为文件创建`链接`。默认是硬链接。

- -s 创建软连接。

注意：符号链接文件不是一个独立的文件，它的许多属性依赖于源文件，所以给符号链接文件设置存取权限是没有意义的。

链接又可分为两种 : `硬链接(hard link)`与`软链接(symbolic link，又叫做 符号链接)`，硬链接的意思是一个档案可以有多个名称，而软链接的方式则是产生一个特殊的档案，该档案的内容是指向另一个档案的位置。硬链接是存在同一个文件系统中，而软链接却可以跨越不同的文件系统。

#### 2.2.3 rename

> rename 命令用字符串替换的方式批量重命名。

```shell
# 将 main1.c 重命名为 main.c
rename main1.c main.c main1.c

rename "s/AA/aa/" *             # 把文件名中的 AA 替换成 aa
rename "s//.html//.php/" *      # 把 .html 后缀的改成 .php 后缀
rename "s/$//.txt/" *           # 把所有的文件名都以 txt 结尾
rename "s//.txt//" *            # 把所有以 .txt 结尾的文件名的.txt 删掉
```

#### 2.2.4 stat 

> stat 命令用于显示文件的状态信息。stat 命令的输出信息比 ls 命令的输出信息要更详细。

#### 2.2.5 file 

> file 命令用来探测给定文件的类型。file 命令对文件的检查分为文件系统、魔法幻数检查和语言检查 3 个过程。

示例：

```shell
file install.log          # 显示文件类型
file -b install.log       # 不显示文件名称
file -i install.log       # 显示 MIME 类型
file -L /var/spool/mail   # 显示符号链接的文件类型
```

#### 2.2.6 chmod

>  chmod 命令用来变更文件或目录的权限。

- -R : 对目前目录下的所有文件与子目录进行相同的权限变更(即以递归的方式逐个变更)

![image](https://github.com/ITholmes/hello-world/assets/70437837/ae6368a9-3195-4619-9e1e-7276c0d0b54b)


三种执行权限对应值：

```shell
r=读取属性　　//值＝ 4
w=写入属性　　//值＝ 2
x=执行属性　　//值＝ 1
```

知识扩展：

```shell
  -rw-r--r--   1 user  staff   651 Oct 12 12:53 .gitmodules
# ↑╰┬╯╰┬╯╰┬╯
# ┆ ┆  ┆  ╰┈ 0 其他人
# ┆ ┆  ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ g 属组
# ┆ ╰┈┈┈┈ u 属主
# ╰┈┈ 第一个字母 `d` 代表目录，`-` 代表普通文件

# 案例：
chmod u=rwx,g=rw,o=r file01 # 为属主，属组，其他人设定不同权限
chmod a+x file01 # 对文件file01的u,g,o都设置可执行属性

# -R : 对目前目录下的所有文件与子目录进行相同的权限变更(即以递归的方式逐个变更)
chmod -R  755 /home/wwwroot/*

# 如果不跟u，g，o的话就全部减了。 同样 +x 也是 一样的。
chmod -x /home/wwwroot/*

# 对应u是7，g是7，o是7
chmod 777 a.txt  
```

知识点：
- 在所有命令中，大多数` -r 参数命令`就可以理解为递归，文件夹的递归，文件夹下的文件或者文件夹，这样好记，方便理解。

#### 2.2.7 chown

>  chown 命令改变某个文件或目录的所有者和所属的组，该命令可以向某个用户授权，使该用户变成指定文件的所有者或者改变文件所属的组。
- 只有文件拥有者和超级用户才可以便用该命令。
  示例：

```shell
# 将目录/usr/meng及其下面的所有文件、子目录的文件主改成 liu
chown -R liu /usr/meng
```

#### 2.2.8 locate 和 updatedb 

> locate 命令和 slocate 命令都用来查找文件或目录。

> locate 命令其实是 find -name 的另一种写法，但是要比后者快得多，原因在于它不搜索具体目录，而是`搜索一个数据库/var/lib/locatedb`，这个数据库中含有本地所有文件信息。Linux 系统自动创建这个数据库，并且`每天自动更新一次`，所以`使用 locate 命令查不到最新变动过的文件`。为了避免这种情况，可以在使用 locate 之前，先使用 `updatedb 命令，手动更新数据库`。

示例：

```shell
locate pwd      # 查找和 pwd 相关的所有文件
locate /etc/sh  # 搜索 etc 目录下所有以 sh 开头的文件
```

> updatedb 命令用来创建或更新 slocate/locate 命令所必需的数据库文件。

- updatedb 命令的执行过程较长，因为在执行时它会遍历整个系统的目录树，并将所有的文件信息写入 slocate/locate 数据库文件中。

如果locate命令，不起作用，那就是没有更新数据库的原因。就限制性updatedb命令，之后再查找就可。

#### 2.2.9 find 

> find 命令用来在指定目录下查找文件。任何位于参数之前的字符串都将被视为欲查找的目录名。如果使用该命令时，不设置任何参数，则 find 命令将在当前目录下查找子目录与文件。并且将查找到的子目录和文件全部进行显示。

- -name name, -iname name : 文件名称符合 name 的文件。iname 会忽略大小写

示例：

```shell
# 当前目录搜索所有文件，文件内容 包含 “140.206.111.111” 的内容
find . -type f -name "*" | xargs grep "140.206.111.111"

# 列出当前目录及子目录下所有文件和文件夹
find .

# 在 /home 目录下查找以 .txt 结尾的文件名
find /home -name "*.txt"
# 同上，但忽略大小写
find /home -iname "*.txt"

# 当前目录及子目录下查找所有以 .txt 和 .pdf 结尾的文件
find . -name "*.txt" -o -name "*.pdf"

# 匹配文件路径或者文件
find /usr/ -path "*local*"

# 基于正则表达式匹配文件路径
find . -regex ".*\(\.txt\|\.pdf\)$"
# 同上，但忽略大小写
find . -iregex ".*\(\.txt\|\.pdf\)$"

# 找出 /home 下不是以 .txt 结尾的文件
find /home ! -name "*.txt"
```

#### 2.2.10 which 

> which命令：查找命令的绝对路径。

#### 2.2.11 whereis

> whereis命令： 查找命令的程序、源代码等相关文件
- which + whereis 只能查找系统里面对应的环境变量$PATH设置的目录里查找符合条件的文件。

小知识点：
- **在/etc/profile，有时会看到`:$PATH` ，这个符号理解为将原来PATH下的内容，追加到后面。win7是用`;分号`进行分隔追加PATH路径，在这里道理一样的。**

### 2.3 文件和目录通用管理

#### 2.3.1 cp  

> cp 命令用来将一个或多个源文件或者目录复制到指定的目的文件或目录。
- 默认情况下，cp 命令不能复制目录，如果要复制目录，则必须使用`-r`选项；

示例：
```shell
# 将文件 file 复制到目录 /usr/men/tmp 下，并改名为 file1
cp file /usr/men/tmp/file1

# 将目录 /usr/men下的所有文件及其子目录复制到目录 /usr/zh 中
cp -r /usr/men /usr/zh

# 强行将 /usr/men下的所有文件复制到目录 /usr/zh 中，无论是否有文件重复
cp -rf /usr/men/* /usr/zh

# 将目录 /usr/men 中的以 m 打头的所有 .c 文件复制到目录 /usr/zh 中
cp -i /usr/men m*.c /usr/zh
```

#### 2.3.2 mv

> mv 命令用来对文件或目录重新命名，或者将文件从一个目录移到另一个目录中。

示例：
```shell
mv file1.txt /home/office/                      # 移动单个文件
mv file2.txt file3.txt file4.txt /home/office/  # 移动多个文件
mv *.txt /home/office/                          # 移动所有 txt 文件
mv dir1/ /home/office/                          # 移动目录
mv /usr/men/* .                                 # 将指定目录中的所有文件移到当前目录中

mv file1.txt file2.txt          # 重命名文件
mv dir1/ dir2/                  # 重命名目录
mv -v *.txt /home/office        # 打印移动信息
mv -i file1.txt /home/office    # 提示是否覆盖文件

mv -uv *.txt /home/office       # 源文件比目标文件新时才执行更新
mv -vn *.txt /home/office       # 不要覆盖任何已存在的文件
mv -f *.txt /home/office        # 无条件覆盖已经存在的文件
mv -bv *.txt /home/office       # 复制时创建备份
```

#### 2.3.3 rm

> rm 命令可以删除一个目录中的一个或多个文件或目录，也可以将某个目录及其下属的所有文件及其子目录均删除掉。对于链接文件，只是删除整个链接文件，而原有文件保持不变。

- -r 将目录及以下之档案亦逐一删除。 -r就有牵连目录以及目录以下的意思。

示例：
```shell
rm test.txt               # 删除文件
rm -i test.txt test2.txt  # 交互式删除文件
rm -r *                   # 删除当前目录下的所有文件和目录
rm -r testdir             # 删除目录下的所有文件和目录
rm -rf testdir            # 强制删除目录下的所有文件和目录
rm -v testdir             # 显示当前删除操作的详情
```

#### 2.3.4 scp

> scp 命令用于在 Linux 下进行远程拷贝文件的命令，和它类似的命令有 cp，不过 cp 只是在本机进行拷贝不能跨服务器，而且 scp 传输是加密的。可能会稍微影响一下速度。当你服务器硬盘变为只读 read only system 时，用 scp 可以帮你把文件移出来。另外，scp 还非常不占资源，不会提高多少系统负荷，在这一点上，rsync 就远远不及它了。虽然 rsync 比 scp 会快一点，但当小文件众多的情况下，rsync 会导致硬盘 I/O 非常高，而 scp 基本不影响系统正常使用。

示例：
```shell
# 拷贝文件到远程服务器的指定目录
scp <file>  <user> @<ip> :<url> 
scp test.txt root@192.168.0.1:/opt

# 拷贝目录到远程服务器的指定目录
scp -r <folder>  <user> @<ip> :<url> 
scp -r test root@192.168.0.1:/opt
```

#### 2.3.4 rsync

作用：高效同步文件（仅传输差异部分，支持断点续传）。

```shell
rsync -avz --delete /local/path user@host:/remote/path

-a：归档模式（保留权限、时间戳等）。
-v：显示详细过程。
-z：压缩传输以节省带宽。
--delete：删除目标端多余文件（保持严格一致）。
```

### 2.3.5 `xsync` 脚本的工作流程

1. 编写 `xsync` 脚本

```shell
#!/bin/bash

#1. 判断参数个数
if [ $# -lt 1 ]
then
  echo Not Enough Arguement!
  exit;
fi

#2. 遍历集群所有机器
for host in hadoop102 hadoop103 hadoop104
do
  echo ====================  $host  ====================
  #3. 遍历所有目录，挨个发送
  for file in $@
  do
    #4 判断文件是否存在
    if [ -e $file ]
    then
      #5. 获取父目录
      pdir=$(cd -P $(dirname $file); pwd)
      #6. 获取当前文件的名称
      fname=$(basename $file)
      ssh $host "mkdir -p $pdir"
      rsync -av $pdir/$fname $host:$pdir
    else
      echo $file does not exists!
    fi
  done
done
```

2. 授予权限

```shell
chmod 777 xsync
```

3. 测试将 `xsync` 脚本分发给其他linux系统上。

```shell
./xsync xsync
```


## 3. Linux 之 文件内容查看 和 编辑

> **关键词：`cat`, `head`, `tail`, `more`, `less`, `sed`, `vi`, `grep`。**

### 3.1 cat 

> cat 命令用于连接文件并打印到标准输出设备上。

示例：
```shell
cat m1              # 在屏幕上显示文件 ml 的内容
cat m1 m2           # 同时显示文件 ml 和 m2 的内容
cat m1 m2 >  file    # 将文件 ml 和 m2 合并后放入文件 file 中
```

### 3.2 head 

> head 命令用于显示文件的开头内容。
- 在默认情况下，head 命令显示文件的头部 10 行内容。
- -n11参数：相当于查看头部的第11行。

```shell
head -n11 file01 # 查看file01文件开头的11行
```

### 3.3 tail
> tail 命令用于显示文件的尾部内容。

- 在默认情况下，tail 命令显示文件的尾部 10 行内容。
- -n11命令：相当于查看尾部最后的11行。
- tail -f 监视文件，一直监视者。

示例：
```shell
tail file           # 显示文件file的最后10行
tail -n +20 file    # 显示文件file的内容，从第20行至文件末尾
tail -c 10 file     # 显示文件file的最后10个字符
```

**tail -f 监听的使用：**

- 所以有时候，一般看tomcat日志，就用tail -f来监听tomcat日志啥的。
- 注意:` tail -f 使用vim是不可以的！！！必须追加的内容才行`，像echo > >  xxx来追加。

```shell
echo 123 > >  aa 追加aa文件中。
echo 123 >  aa 覆盖aa文件中的内。

tail -f ./aaas # 一直监控aaas文件
```

![image](https://github.com/ITholmes/hello-world/assets/70437837/4b2185d1-fde7-4b2d-bb70-9ab0351c53c9)

### 3.4 more

> more 命令是一个基于 vi 编辑器文本过滤器，它以全屏幕的方式按页显示文本文件的内容，支持 vi 中的关键字定位操作。`more 名单中内置了若干快捷键，常用的有 H（获得帮助信息），Enter（向下翻滚一行），空格（向下滚动一屏），Q（退出命令）`。
- 按 Space 键：显示文本的下一屏内容。
- 按 Enier 键：只显示文本的下一行内容。
- 按斜线符|：接着输入一个模式，可以在文本中寻找下一个相匹配的模式。
- 按 H 键：显示帮助屏，该屏上有相关的帮助信息。
- 按 B 键：显示上一屏内容。
- 按 Q 键：退出 rnore 命令。

示例：
```shell
# 显示文件 file 的内容，但在显示之前先清屏，并且在屏幕的最下方显示完核的百分比。
more -dc file

# 显示文件 file 的内容，每 10 行显示一次，而且在显示之前先清屏。
more -c -10 file
```

**注意：more命令只能向前浏览。**

### 3.5 less

> less 命令的作用与 more 十分相似，都可以用来浏览文字档案的内容，不同的是`less 命令允许用户向前或向后浏览文件`，而 more 命令只能向前浏览。用 less 命令显示文件时，用` PageUp 键向上翻页，用 PageDown 键向下翻页`。要退出 less 程序，应按 Q 键。

### 3.6 sed

> sed 是一种流编辑器，它是文本处理工具，能够完美的配合正则表达式使用，功能不同凡响。处理时，把当前处理的行存储在临时缓冲区中，称为“模式空间”（pattern space），接着用 sed 命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。文件内容并没有改变，除非你使用重定向存储输出。Sed 主要用来自动编辑一个或多个文件；简化对文件的反复操作；编写转换程序等。

```shell
# 替换文本中的字符串
sed 's/book/books/' file

# -n 选项 和 p 命令 一起使用表示只打印那些发生替换的行
sed -n 's/test/TEST/p' file

# 直接编辑文件选项 -i ，会匹配 file 文件中每一行的第一个 book 替换为 books
sed -i 's/book/books/g' file

# 使用后缀 /g 标记会替换每一行中的所有匹配
sed 's/book/books/g' file

# 删除空白行
sed '/^$/d' file

# 删除文件的第2行
sed '2d' file

# 删除文件的第2行到末尾所有行
sed '2,$d' file

# 删除文件最后一行
sed '$d' file

# 删除文件中所有开头是test的行
sed '/^test/'d file

```

### 3.7 vi

> vi 命令是 UNIX 操作系统和类 UNIX 操作系统中最通用的全屏幕纯文本编辑器。Linux 中的 vi 编辑器叫 `vim，它是 vi 的增强版（vi Improved）`，与 vi 编辑器完全兼容，而且实现了很多增强功能。

### 3.8 grep

> grep（global search regular expression(RE) and print out the line，全面搜索正则表达式并把行打印出来）是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。

示例：

```shell
# 在多级目录中对文本递归搜索(程序员搜代码的最爱）:
$ grep "class" . -R -n

# 忽略匹配样式中的字符大小写
$ echo "hello world" | grep -i "HELLO"

# 匹配多个模式:
$ grep -e "class" -e "vitural" file

# 只在目录中所有的.php和.html文件中递归搜索字符"main()"
$ grep "main()" . -r --include *.{php,html}

# 在搜索结果中排除所有README文件
$ grep "main()" . -r --exclude "README"

# 在搜索结果中排除filelist文件列表里的文件
$ grep "main()" . -r --exclude-from filelist
```

## 4. Linux 文件压缩和解压

> **关键词：`tar`, `gzip`, `zip`, `unzip`。**


### 4.1 tar

> tar 配合参数，实现打包，压缩，解压缩等等操作。

示例：
**tar 打包：**

```shell
tar -cvf a.tar a.txt #仅仅打包，不会压缩，后缀名名字最好是.tar，也为了方便解压。
```

![image](https://github.com/ITholmes/hello-world/assets/70437837/43d0ba8a-6c9c-412e-a118-c090f95e8d55)

**tar 打包 + 压缩(gzip形式压缩)**

```shell
# 打包 + 压缩(gzip形式压缩)
tar -zcvf a.tar.gz a.txt  # 打包后，以 gzip 压缩，后缀名最好是.tar.gz。
```

![image](https://github.com/ITholmes/hello-world/assets/70437837/c9168d23-280c-45e8-bf55-13169ce109f8)

**tar 打包+压缩(bzip2形式压缩)**

```shell
tar -jcvf a.tar.bz2 a.txt # 打包后，以 bzip2 压缩
```

![image](https://github.com/ITholmes/hello-world/assets/70437837/feadcf03-b4c7-49e0-87c7-2afda7831341)

**tar 解压缩：**

```shell
tar -ztvf log.tar.gz                    # 查阅上述 tar 包内有哪些文件
tar -zxvf log.tar.gz                    # 将 tar 包解压缩
tar -zxvf log30.tar.gz log2013.log      # 只将 tar 内的部分文件解压出来
```

### 4.2 gzip

> gzip 命令用来压缩文件。gzip 是个使用广泛的压缩程序，文件经它压缩过后，其名称后面会多出“.gz”扩展名。

gzip 是在 Linux 系统中经常使用的一个对文件进行压缩和解压缩的命令，既方便又好用。gzip 不仅可以用来压缩大的、较少使用的文件以节省磁盘空间，还可以和 tar 命令一起构成 Linux 操作系统中比较流行的压缩文件格式。据统计，gzip 命令对文本文件有 60%～ 70%的压缩率。减少文件大小有两个明显的好处，一是可以减少存储空间，二是通过网络传输文件时，可以减少传输的时间。

示例：

```shell
gzip * # 将所有文件压缩成 .gz 文件
gzip -l * # 详细显示压缩文件的信息，并不解压
gzip -dv * # 解压上例中的所有压缩文件，并列出详细的信息
gzip -r log.tar     # 压缩一个 tar 备份文件，此时压缩文件的扩展名为.tar.gz
gzip -rv test/      # 递归的压缩目录
gzip -dr test/      # 递归地解压目录
```

### 4.3 zip

> zip 命令用于压缩文件。zip 是个使用广泛的压缩程序，文件经它压缩后会另外产生具有“.zip”扩展名的压缩文件。

示例：

```shell
# 将 /home/Blinux/html/ 这个目录下所有文件和文件夹打包为当前目录下的 html.zip
zip -q -r html.zip /home/Blinux/html
```

### 4.4 unzip

> unzip 命令用于解压缩由 zip 命令压缩的“.zip”压缩包。

示例：

```shell
unzip test.zip              # 解压 zip 文件
unzip -n test.zip -d /tmp/  # 在指定目录下解压缩
unzip -o test.zip -d /tmp/  # 在指定目录下解压缩，如果有相同文件存在则覆盖
unzip -v test.zip           # 查看压缩文件目录，但不解压
```

## 5. Linux 之 硬件管理

> **关键词：`df`, `du`, `top`, `free`, `iotop`。**

### 5.1 df

> df 命令(disk)用于`显示磁盘分区上的可使用的磁盘空间`。默认显示单位为 KB。可以利用该命令来获取硬盘被占用了多少空间，目前还剩下多少空间等信息。

df命令显示的名称对应：

![image](https://github.com/ITholmes/hello-world/assets/70437837/94cd0516-9336-47b0-88eb-559f062b333b)

示例：
```shell
# 查看系统磁盘设备，默认是 KB 为单位
[root@root ~] df
文件系统               1K-块        已用     可用 已用% 挂载点
/dev/sda2            146294492  28244432 110498708  21% /
/dev/sda1              1019208     62360    904240   7% /boot
tmpfs                  1032204         0   1032204   0% /dev/shm
/dev/sdb1            2884284108 218826068 2518944764   8% /data1

# 使用 -h 选项以 KB 以上的单位来显示，可读性高
[root@root ~] df -h
文件系统              容量  已用 可用 已用% 挂载点
/dev/sda2             140G   27G  106G  21% /
/dev/sda1             996M   61M  884M   7% /boot
tmpfs                1009M     0 1009M   0% /dev/shm
/dev/sdb1             2.7T  209G  2.4T   8% /data1

# 查看全部文件系统
[root@root ~] df -a
文件系统               1K-块        已用     可用 已用% 挂载点
/dev/sda2            146294492  28244432 110498708  21% /
proc                         0         0         0   -  /proc
sysfs                        0         0         0   -  /sys
devpts                       0         0         0   -  /dev/pts
/dev/sda1              1019208     62360    904240   7% /boot
tmpfs                  1032204         0   1032204   0% /dev/shm
/dev/sdb1            2884284108 218826068 2518944764   8% /data1
none                         0         0         0   -  /proc/sys/fs/binfmt_misc
```

### 5.2 du 

> du 命令是`对文件和目录磁盘使用的空间的查看`。

示例：

```shell
# 显示目录或者文件所占空间
root@localhost [test]# du
608 ./test6
308 ./test4
4 ./scf/lib
4 ./scf/service/deploy/product
4 ./scf/service/deploy/info
12 ./scf/service/deploy
16 ./scf/service
4 ./scf/doc
4 ./scf/bin
32 ./scf
8 ./test3
1288 .

# 显示指定文件所占空间
[root@localhost test]# du log2012.log
300 log2012.log

# 查看指定目录的所占空间
[root@localhost test]# du scf
4 scf/lib
4 scf/service/deploy/product
4 scf/service/deploy/info
12 scf/service/deploy
16 scf/service
4 scf/doc
4 scf/bin
32 scf

# 显示多个文件所占空间
[root@localhost test]# du log30.tar.gz log31.tar.gz
4 log30.tar.gz
4 log31.tar.gz

# 只显示总和的大小
[root@localhost test]# du -s
1288 .

[root@localhost test]# du -s scf
32 scf
```

### 5.3 top

> top 命令，就可以`理解为linux系统的任务管理器`。实时动态地查看系统的整体运行情况，是一个综合了多方信息监测系统性能和运行信息的实用工具。

按进程的CPU使用率排序：

- 运行top命令后，键入大写P。

进程的内存使用率排序：

- 运行top命令后，键入大写M。

### 5.4 free 

> free 命令，`针对内存的`，可以显示当前系统未使用的和已使用的内存数目，还可以显示被内核使用的内存缓冲区。

示例：

```shell
free -t    # 以总和的形式显示内存的使用信息
free -s 10 # 周期性的查询内存使用信息，每10s 执行一次命令

# 显示内存使用情况

free -m
             total       used       free     shared    buffers     cached
Mem:          2016       1973         42          0        163       1497
-/+ buffers/cache:        312       1703
Swap:         4094          0       4094
```

### 5.5 iotop (需要安装)

> iotop 命令是一个用来监视磁盘 I/O 使用状况的 top 类工具。

![image](https://github.com/ITholmes/hello-world/assets/70437837/8161a4bc-b979-4d66-a16d-be2c972042f5)

## 6. Linux 之 网络管理

> **关键词：`curl`,`wget`, `telnet`, `ip`, `hostname`, `ifconfig`, `route`, `ssh`, `ssh-keygen`, `firewalld`, `iptables`, `host`, `nslookup`, `nc/netcat`, `ping`, `traceroute`, `netstat`。**

### 6.1 curl、wget

`curl` 是一个命令行工具，用于通过 URL 与服务器进行交互。它支持多种协议（如 HTTP、HTTPS、FTP、SFTP、SMTP 等），主要用于发送请求、接收响应和与远程服务器交换数据。

用途：

1. 发送 HTTP 请求，使用 `-X` 指定 HTTP 方法，适用于非默认的 HTTP 动作（如 DELETE、PUT）。

```bash
# GET 请求：请求某个 URL 的内容（默认就是 GET 请求）。
curl https://jsonplaceholder.typicode.com/posts

# POST 请求：向服务器提交数据（例如，提交表单数据或 JSON 数据）。
curl -X POST -d "name=John&age=30" https://jsonplaceholder.typicode.com/users

# 发送 JSON 数据的例子：
curl -X POST -H "Content-Type: application/json" -d '{"name": "John", "age": 30}' https://jsonplaceholder.typicode.com/users

# PUT 请求：用于更新资源。
curl -X PUT -d '{"name": "John Updated", "age": 31}' https://jsonplaceholder.typicode.com/users/1

# DELETE 请求：删除资源。
curl -X DELETE https://jsonplaceholder.typicode.com/users/1
```

2. 上传文件

```bash
# 使用 -F 参数上传文件到服务器（例如，上传图片到某个 API）。
curl -X POST -F "file=@/path/to/file.jpg" https://example.com/upload
```

3. 获取响应头信息

```bash
# 只获取响应头，而不获取内容，使用 -I（或 --head）参数。
curl -I https://www.example.com

# 显示详细的响应头信息（包括请求头、响应头等）。
curl -v https://www.example.com
```

4. 指定请求头

```bash
# 设置自定义的 HTTP 请求头。例如，模拟浏览器请求：
curl -H "User-Agent: Mozilla/5.0" https://www.example.com

# 发送带有 Authorization 头部的请求（例如，Bearer Token 或基本认证）。
curl -H "Authorization: Bearer <your_token>" https://api.example.com/data

# 使用基本认证
curl -u "username:password" https://api.example.com/protected
```

5. 身份认证

```bash
# 使用基本认证（-u）进行身份验证。
curl -u "username:password" https://protected.example.com
```

6. 支持重定向，默认情况下，curl 不会自动跟随 HTTP 重定向

```bash
# 默认情况下，curl 不会自动跟随 HTTP 重定向。如果你想让它自动跟随，可以使用 -L 参数。
curl -L https://example.com/redirect
```

7. 设置代理

```bash
# 使用 -x 或 --proxy 设置 HTTP 代理。
curl -x http://proxy.example.com:8080 https://www.example.com
```

8. 下载文件

```shell
# 下载文件
curl http://man.linuxde.net/text.iso --silent

# 使用 -o 将文件下载到本地，指定保存的文件名。
curl http://man.linuxde.net/test.iso -o filename.iso --progress
########################################## 100.0%

# 使用 -O 直接保存文件名为服务器上文件的名称。
curl -O https://www.example.com/file.zip
```

9. `max-time` 设置超时

```bash
# 设置连接超时和响应超时，防止 curl 请求无响应时长时间等待。
curl --max-time 10 https://www.example.com
```

10. 请求携带 Cookies

```bash
# 使用 -b 发送 Cookies，例如，模拟用户登录后请求某个页面。
curl -b "name=value; sessionid=12345" https://www.example.com/dashboard

# 保存响应中的 Cookies，使用 -c。
curl -c cookies.txt https://www.example.com
```

11. 调试请求

```bash
# 使用 -v（verbose）调试请求和响应，查看详细的通信过程。
curl -v https://www.example.com
```

> wget 命令用来从指定的 URL 下载文件。

示例：

```shell
# 使用 wget 下载单个文件
$ wget http://www.linuxde.net/testfile.zip
```

### 6.2 telnet 

> telnet 命令一般用作测试远程端口连接，功能是用于远端登入。

示例：

```shell
telnet 192.168.2.10
Trying 192.168.2.10...
Connected to 192.168.2.10 (192.168.2.10).
Escape character is '^]'.

    localhost (Linux release 2.6.18-274.18.1.el5 #1 SMP Thu Feb 9 12:45:44 EST 2012) (1)

login: root
Password:
Login incorrect
```

### 6.4 ip

> ip 命令用来查看或操纵 Linux 主机的路由、网络设备、策略路由和隧道，是 Linux 下较新的功能强大的网络配置工具。

示例：

```shell
$ ip link show                     # 查看网络接口信息
$ ip link set eth0 upi             # 开启网卡
$ ip link set eth0 down            # 关闭网卡
$ ip link set eth0 promisc on      # 开启网卡的混合模式
$ ip link set eth0 promisc offi    # 关闭网卡的混个模式
$ ip link set eth0 txqueuelen 1200 # 设置网卡队列长度
$ ip link set eth0 mtu 1400        # 设置网卡最大传输单元
$ ip addr show     # 查看网卡IP信息
$ ip addr add 192.168.0.1/24 dev eth0 # 设置eth0网卡IP地址192.168.0.1
$ ip addr del 192.168.0.1/24 dev eth0 # 删除eth0网卡IP地址

$ ip route show # 查看系统路由
$ ip route add default via 192.168.1.254   # 设置系统默认路由
$ ip route list                 # 查看路由信息
$ ip route add 192.168.4.0/24  via  192.168.0.254 dev eth0 # 设置192.168.4.0网段的网关为192.168.0.254,数据走eth0接口
$ ip route add default via  192.168.0.254  dev eth0        # 设置默认网关为192.168.0.254
$ ip route del 192.168.4.0/24   # 删除192.168.4.0网段的网关
$ ip route del default          # 删除默认路由
$ ip route delete 192.168.1.0/24 dev eth0 # 删除路由
```

### 6.5 hostname

> hostname 命令`用于查看和设置系统的主机名称`。环境变量 HOSTNAME 也保存了当前的主机名。在使用 hostname 命令设置主机名后，系统并不会永久保存新的主机名，重新启动机器之后还是原来的主机名。如果需要永久修改主机名，需要同时修改 /etc/hosts 和 /etc/sysconfig/network 的相关内容。

### 6.6 ifconfig

> ifconfig 命令`被用于查看和配置 Linux 内核中网络接口的网络参数`。用 ifconfig 命令配置的网卡信息，在网卡重启后机器重启后，配置就不存在。要想将上述的配置信息永远的存的电脑里，那就要修改网卡的配置文件了。

### 6.7 route

> route 命令用来`查看和设置 Linux 内核中的网络路由表`，route 命令设置的路由主要是静态路由。要实现两个不同的子网之间的通信，需要一台连接两个网络的路由器，或者同时位于两个网络的网关来实现。

示例：

```shell
# 查看当前路由
route
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
112.124.12.0    *               255.255.252.0   U     0      0        0 eth1
10.160.0.0      *               255.255.240.0   U     0      0        0 eth0
192.168.0.0     10.160.15.247   255.255.0.0     UG    0      0        0 eth0
172.16.0.0      10.160.15.247   255.240.0.0     UG    0      0        0 eth0
10.0.0.0        10.160.15.247   255.0.0.0       UG    0      0        0 eth0
default         112.124.15.247  0.0.0.0         UG    0      0        0 eth1

route add -net 224.0.0.0 netmask 240.0.0.0 dev eth0    # 添加网关/设置网关
route add -net 224.0.0.0 netmask 240.0.0.0 reject      # 屏蔽一条路由
route del -net 224.0.0.0 netmask 240.0.0.0             # 删除路由记录
route add default gw 192.168.120.240                   # 添加默认网关
route del default gw 192.168.120.240                   # 删除默认网关
```

### 6.8 ssh

> ssh 命令是 `openssh 套件中的客户端连接工具`，可以给予 ssh 加密协议实现安全的`远程登录服务器`。

示例：

```shell
# ssh 用户名@远程服务器地址
ssh user1@172.24.210.101
# 指定端口
ssh -p 2211 root@140.206.185.170
```

### 6.9 ssh-keygen 

> ssh-keygen 命令用于`为 ssh 生成、管理和转换认证密钥`，它支持 RSA 和 DSA 两种认证密钥。

### 6.10 firewalld

> firewalld 命令是 Linux 上的`防火墙软件`。

#### 6.10.1 firewalld 的基本使用

1. 启动 - systemctl start firewalld
2. 关闭 - systemctl stop firewalld
3. 查看状态 - systemctl status firewalld
4. 开机禁用 - systemctl disable firewalld
5. 开机启用 - systemctl enable firewalld

#### 6.10.2 使用 systemctl 管理 firewalld 服务

> systemctl 是服务管理工具中主要的工具，它融合之前 service 和 chkconfig 的功能于一体。

- 启动一个服务 - systemctl start firewalld.service
- 关闭一个服务 - systemctl stop firewalld.service
- 重启一个服务 - systemctl restart firewalld.service
- 显示一个服务的状态 - systemctl status firewalld.service
- 在开机时启用一个服务 - systemctl enable firewalld.service
- 在开机时禁用一个服务 - systemctl disable firewalld.service
- 查看服务是否开机启动 - systemctl is-enabled firewalld.service
- 查看已启动的服务列表 - systemctl list-unit-files|grep enabled
- 查看启动失败的服务列表 - systemctl --failed

#### 6.10.3 配置 firewall-cmd（需要安装）

1. 查看版本 - firewall-cmd --version
2. 查看帮助 - firewall-cmd --help
3. 显示状态 - firewall-cmd --state
4. 查看所有打开的端口 - firewall-cmd --zone=public --list-ports
5. 更新防火墙规则 - firewall-cmd --reload
6. 查看区域信息: firewall-cmd --get-active-zones
7. 查看指定接口所属区域 - firewall-cmd --get-zone-of-interface=eth0
8. 拒绝所有包：firewall-cmd --panic-on
9. 取消拒绝状态 - firewall-cmd --panic-off
10. 查看是否拒绝 - firewall-cmd --query-panic

#### 6.10.4 在防火墙中开放一个端口(常用)

- 添加（--permanent 永久生效，没有此参数重启后失效） - firewall-cmd --zone=public --add-port=80/tcp --permanent
- 重新载入 - firewall-cmd --reload
- 查看 - firewall-cmd --zone= public --query-port=80/tcp
- 删除 - firewall-cmd --zone= public --remove-port=80/tcp --permanent

### 6.11 iptables 

> iptables 命令是` Linux 上常用的防火墙软件`，是 netfilter 项目的一部分。可以直接配置，也可以通过许多前端和图形界面配置。


示例：

```shell
# 开放指定的端口
iptables -A INPUT -s 127.0.0.1 -d 127.0.0.1 -j ACCEPT               #允许本地回环接口(即运行本机访问本机)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT    #允许已建立的或相关连的通行
iptables -A OUTPUT -j ACCEPT         #允许所有本机向外的访问
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    #允许访问22端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    #允许访问80端口
iptables -A INPUT -p tcp --dport 21 -j ACCEPT    #允许ftp服务的21端口
iptables -A INPUT -p tcp --dport 20 -j ACCEPT    #允许FTP服务的20端口
iptables -A INPUT -j reject       #禁止其他未允许的规则访问
iptables -A FORWARD -j REJECT     #禁止其他未允许的规则访问

# 屏蔽IP
iptables -I INPUT -s 123.45.6.7 -j DROP       #屏蔽单个IP的命令
iptables -I INPUT -s 123.0.0.0/8 -j DROP      #封整个段即从123.0.0.1到123.255.255.254的命令
iptables -I INPUT -s 124.45.0.0/16 -j DROP    #封IP段即从123.45.0.1到123.45.255.254的命令
iptables -I INPUT -s 123.45.6.0/24 -j DROP    #封IP段即从123.45.6.1到123.45.6.254的命令是

# 查看已添加的iptables规则
iptables -L -n -v
Chain INPUT (policy DROP 48106 packets, 2690K bytes)
 pkts bytes target     prot opt in     out     source               destination
 5075  589K ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0
 191K   90M ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp dpt:22
1499K  133M ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp dpt:80
4364K 6351M ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
 6256  327K ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 3382K packets, 1819M bytes)
 pkts bytes target     prot opt in     out     source               destination
 5075  589K ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0
```

### 6.12 host 

> host 命令是常用的`分析域名查询工具`，可以用来`测试域名系统工作是否正常`。

![image](https://github.com/ITholmes/hello-world/assets/70437837/4cf48dbb-02ff-4c00-b30d-7010713aeccb)

### 6.13 nslookup

> nslookup 命令是常用域名查询工具，就是查 DNS 信息用的命令。

![image](https://github.com/ITholmes/hello-world/assets/70437837/1a63205e-7c80-4f41-86c8-9cdf62306ebd)


### 6.14 nc/netcat

> nc 命令是 netcat 命令的简称，都是用来设置路由器。

### 6.15 ping

> ping 命令用来`测试主机之间网络的连通性`。

### 6.16 traceroute（需要安装）

> traceroute 命令用于`追踪数据包在网络上的传输时的全部路径`，它默认发送的数据包大小是 40 字节。

![image](https://github.com/ITholmes/hello-world/assets/70437837/e8e4b0f2-8852-4896-a875-3cc64661dcc1)

### 6.17 netstat

> netstat 命令用于`显示网络状态`，打印 Linux 中网络系统的状态信息，可让你得知整个 Linux 系统的网络情况。

解释一下 - n 参数命令的效果：

![image](https://github.com/ITholmes/hello-world/assets/70437837/ac1b1dcc-b16e-4568-bcf2-17a66259a9a8)

示例：

```shell
# 列出所有端口 (包括监听和未监听的)
netstat -a     #列出所有端口
netstat -at    #列出所有tcp端口
netstat -au    #列出所有udp端口

# 列出所有处于监听状态的 Sockets
netstat -l        #只显示监听端口
netstat -lt       #只列出所有监听 tcp 端口
netstat -lu       #只列出所有监听 udp 端口
netstat -lx       #只列出所有监听 UNIX 端口

# 显示每个协议的统计信息
netstat -s   显示所有端口的统计信息
netstat -st   显示TCP端口的统计信息
netstat -su   显示UDP端口的统计信息
```

## 7. Linux 之 用户管理

> **关键词：`groupadd`, `groupdel`, `groupmod`, `useradd`, `userdel`, `usermod`, `passwd`, `su`, `sudo`。**


### 7.1 groupadd

> groupadd 命令用于`创建一个新的用户组`，新用户组的信息将被添加到系统文件中。

- -g：指定新建工作组的 id。设置组ID，最好不要小于等于1000以下，因为1000内已经有很多系统自带的组。

相关文件:

- /etc/group 组账户信息。
- /etc/gshadow 安全组账户信息。
- /etc/login.defs Shadow密码套件配置。

示例：

```shell
# 建立一个新组，344就是设置组ID，
$ groupadd -g 344 itholmes

# 此时在 /etc/group 文件中产生一个组 ID（GID）是 344 的项目。
$ less /etc/group

# 使用tail -1 更好！！
$ tail -1 /etc/group
itholmes:x:344:
```

![image](https://github.com/ITholmes/hello-world/assets/70437837/f8e88a55-7e9a-4792-819a-4d4e72fc5b14)

### 7.2 groupdel 

> groupdel 命令用于`删除指定的用户组`，本命令要修改的系统文件包括 /ect/group 和 /ect/gshadow。若该群组中仍包括某些用户，则必须先删除这些用户后，方能删除群组。

### 7.3 groupmod

> groupmod 命令`更改群组识别码(组ID)或名称(组名称)`。

示例：

```shell
# 查看group文件里面，最后一个添加的用户组 
$ tail -1 /etc/group
itholmes:x:344:

# -g：指定新的组ID，-n：指定新的组名称
$ groupmod -g 500 -n itholmesNes itholmes

$ tail -1 /etc/group
itholmesNes:x:500:
```

### 7.4 useradd

> useradd 可用来`建立用户帐号`。帐号建好之后，再用 passwd 设定帐号的密码。`使用 useradd 指令所建立的帐号，实际上是保存在 /etc/passwd 文本文件中`。

- -r ：建立系统帐号。
- -g<群组>  　指定用户所属的群组。
- -G<群组>  　指定用户所属的附加群组。
- -d<登入目录>  　指定用户登入时的起始目录。
- -u\<uid>  　指定用户ID。

用户组：
- 没有指定组，默认就会根据账号名创建一个一样名字的组，该组的ID是已经上个组自增+1，在/etc/group能看到。

![image](https://github.com/ITholmes/hello-world/assets/70437837/6b5d14df-3fcf-41a9-bed5-2854c9b01c2e)


用户目录：

- 没有指定用户目录，默认就是在/home下面创建同名的目录。home是默认创建用户目录的地方。
- 用户对自己的用户目录，有对应的权限，对其他目录，需要根据属主，属组，其他人等权限来判断。通过ll命令或者ls -l命令，来查看。

![image](https://github.com/ITholmes/hello-world/assets/70437837/6336f46d-0550-48db-93bb-239034ede4b5)

示例：

```shell
# 创建新用户itholmes，加入itholmesGroup组中。
$ useradd -d /opt/ -g itholmesGroup -r -u 544 itholmes

# -g：加入主要组、-G：加入次要组
```

小知识点：

- 在使用su切换了用户，可以使用exit来退出当前用户。

### 7.5 userdel

> userdel 命令`用于删除给定的用户，以及与用户相关的文件`。`若不加选项，则仅删除用户帐号，而不删除相关文件`。

- -r 　删除用户登入目录以及目录中所有文件。

### 7.6 usermod

> usermod 命令`用于修改用户的基本信息`。`usermod 命令不允许你改变正在线上的使用者帐号名称。当 usermod 命令用来改变 user id，必须确认这名 user 没在电脑上执行任何程序`。

- -u\<uid>  　修改用户ID。
- -d登入目录>  　修改用户登入时的目录。
- -g<群组>  　修改用户所属的群组。
- -G<群组>  　修改用户所属的附加群组。
- -L 　锁定用户密码，使密码无效。

示例：

```shell
# 更改登录目录
$ usermod -d /home/hnlinux root
# 改变用户的uid
$ usermod -u 123 root
```

### 7.7 passwd

> passwd 命令`用于设置用户的认证信息，包括用户密码、密码过期时间`等。系统管理者则能用它管理系统用户的密码。`只有管理者可以指定用户名称，一般用户只能变更自己的密码`。

示例：

```shell
# 比如我们让某个用户不能修改密码，可以用`-l`选项来锁定：
$ passwd -l linuxde    # 锁定用户linuxde不能更改密码；
Locking password for user linuxde.
passwd: Success           # 锁定成功；

# 通过su切换到itholmes用户；
$ su itholmes 

# -d 清除itholmes用户密码；
$ passwd -d itholmes 

# 查询itholmes用户密码状态
$ passwd -S itholmes 
```

### 7.8 su

> su 命令用于切换当前用户身份到其他用户身份，变更时须输入所要变更的用户帐号与密码。

### 7.9 sudo

#### 7.9.1 sudo使用

> sudo 命令用来以其他身份来执行命令，预设的身份为 root（也就是默认是root）。在 /etc/sudoers 中设置了可执行 sudo 指令的用户。

示例：

```shell
# 指定用户执行命令
$ sudo -u userb ls -l
# 列出目前的权限
$ sudo -l
# 显示sudo设置
$ sudo -L
```

#### 7.9.2 给普通用户授权 sudo

假设要给普通用户 itholmes 配置 sudo 权限：

1. `/etc/sudoers 文件`存放了 sudo 的相关用户，但是默认是没有写权限的，所以需要设为可写：chmod u+w /etc/sudoers。
2. 在该文件中添加 itholmes  ALL=(ALL) ALL ，保存并退出，让 mary 具有 sudo 的所有权限。
3. 再将 /etc/sudoers 的权限恢复到默认状态：chmod u-w /etc/sudoers。

#### 7.9.3 免密码授权 sudo

与给普通用户授权 sudo 类似，区别仅在于第 2 步：mary ALL=(ALL) NOPASSWD: ALL。

## 8. Linux 之 系统管理

> **关键词：`lsb_release`, `reboot`, `exit`, `shutdown`, `date`, `mount`, `umount`, `ps`, `kill`, `systemctl`, `service`, `crontab`。**

### 8.1 reboot

> reboot 命令用来`重新启动正在运行的 Linux 操作系统`。

示例：

```shell
reboot        # 重开机。
reboot -w     # 做个重开机的模拟（只有纪录并不会真的重开机）。
```

### 8.2 exit

>  exit命令用于`退出目前的shell(脚本)`。

- exit [状态值] 状态值0代表执行成功，其他值代表执行失败。

示例：

```shell
$ exit # 单独输入exit是退出终端的意思。
```

### 8.3 shutdown

> shutdown 命令用来`系统关机命令`。shutdown 指令可以关闭所有程序，并依用户的需要，进行重新开机或关机的动作。

示例：

```shell
# 指定现在立即关机
shutdown -h now

# 指定 5 分钟后关机，同时送出警告信息给登入用户
shutdown +5 "System will shutdown after 5 minutes"
```

### 8.4 date

> date 命令是`显示或设置系统时间与日期`。

示例：

```shell
# 格式化输出
date +"%Y-%m-%d"
2009-12-07

# 输出昨天日期
date -d "1 day ago" +"%Y-%m-%d"
2012-11-19

# 2 秒后输出
date -d "2 second" +"%Y-%m-%d %H:%M.%S"
2012-11-20 14:21.31

# 传说中的 1234567890 秒
date -d "1970-01-01 1234567890 seconds" +"%Y-%m-%d %H:%m:%S"
2009-02-13 23:02:30

# 普通转格式
date -d "2009-12-12" +"%Y/%m/%d %H:%M.%S"
2009/12/12 00:00.00

# apache 格式转换
date -d "Dec 5, 2009 12:00:37 AM" +"%Y-%m-%d %H:%M.%S"
2009-12-05 00:00.37

# 格式转换后时间游走
date -d "Dec 5, 2009 12:00:37 AM 2 year ago" +"%Y-%m-%d %H:%M.%S"
2007-12-05 00:00.37

# 加减操作
date +%Y%m%d                   # 显示前天年月日
date -d "+1 day" +%Y%m%d       # 显示前一天的日期
date -d "-1 day" +%Y%m%d       # 显示后一天的日期
date -d "-1 month" +%Y%m%d     # 显示上一月的日期
date -d "+1 month" +%Y%m%d     # 显示下一月的日期
date -d "-1 year" +%Y%m%d      # 显示前一年的日期
date -d "+1 year" +%Y%m%d      # 显示下一年的日期

# 设定时间
date -s                        # 设置当前时间，只有root权限才能设置，其他只能查看
date -s 20120523               # 设置成20120523，这样会把具体时间设置成空00:00:00
date -s 01:01:01               # 设置具体时间，不会对日期做更改
date -s "01:01:01 2012-05-23"  # 这样可以设置全部时间
date -s "01:01:01 20120523"    # 这样可以设置全部时间
date -s "2012-05-23 01:01:01"  # 这样可以设置全部时间
date -s "20120523 01:01:01"    # 这样可以设置全部时间

# 有时需要检查一组命令花费的时间
#!/bin/bash

start=$(date +%s)
nmap man.linuxde.net &>  /dev/null

end=$(date +%s)
difference=$(( end - start ))
echo $difference seconds.
```

### 8.5 mount

> mount 命令用于挂载文件系统到指定的挂载点。

- 挂载是将其他机器上的磁盘映射到本机器上来，使得在本机器上可以访问其他机器的文件；如在IP1服务器上可以访问IP2上的资源。
- 软连接是一种快捷方式，这两个区分好！

### 8.6 umount

> umount 命令用于`卸载已经挂载的文件系统`。利用设备名或挂载点都能 umount 文件系统，不过最好还是通过挂载点卸载，以免使用绑定挂载（一个设备，多个挂载点）时产生混乱。

### 8.7 ps

>  ps 命令用于报告当前系统的进程状态。

示例：

```shell
# 按内存资源的使用量对进程进行排序
ps aux | sort -rnk 4

# 按 CPU 资源的使用量对进程进行排序
ps aux | sort -nk 3
```

### 8.8 kill

> kill 命令用来`删除执行中的程序或工作`。`预设的信息为 SIGTERM(15),可将指定程序终止`。若仍无法终止该程序，可使用` SIGKILL(9) 信息尝试强制删除程序`。

- kill -9 强制杀死， kill 是正常关闭。一般要用kill就行，因为有时就需要正常关闭才行，可以理解为先保存了再关闭！

### 8.9 service

> service 命令是 Redhat Linux 兼容的发行版中用来`控制系统服务的实用工具`，它以启动、停止、重新启动和关闭系统服务，还可以显示所有系统服务的当前状态。

示例：

```shell
service network status
配置设备：
lo eth0
当前的活跃设备：
lo eth0

service network restart
正在关闭接口 eth0：                                        [  确定  ]
关闭环回接口：                                             [  确定  ]
设置网络参数：                                             [  确定  ]
弹出环回接口：                                             [  确定  ]
弹出界面 eth0：                                            [  确定  ]
```

### 8.10 crontab

> crontab 命令被用来提交和管理用户的需要`周期性执行的任务`。

详情见：[https://www.runoob.com/linux/linux-comm-crontab.html](https://www.runoob.com/linux/linux-comm-crontab.html)

![image](https://github.com/ITholmes/hello-world/assets/70437837/dec1b9ff-d66b-4f89-846c-500948cb7e18)

### 8.11 systemctl 

> systemctl 命令是`系统服务管理器指令`，它实际上将 service 和 chkconfig 这两个命令组合到一起。

示例：

```shell
# 1.启动 nfs 服务
systemctl start nfs-server.service

# 2.设置开机自启动
systemctl enable nfs-server.service

# 3.停止开机自启动
systemctl disable nfs-server.service

# 4.查看服务当前状态
systemctl status nfs-server.service

# 5.重新启动某服务
systemctl restart nfs-server.service

# 6.查看所有已启动的服务
systemctl list -units --type=service

# 7. 开启防火墙 22 端口
iptables -I INPUT -p tcp --dport 22 -j accept

# 8. 彻底关闭防火墙
sudo systemctl status firewalld.service
sudo systemctl stop firewalld.service
sudo systemctl disable firewalld.service
```

## 9. Linux 之 软件管理

> **关键词：`rpm`, `yum`, `apt-get`。**

### 9.1 rpm

> rpm 命令是` RPM 软件包的管理工具`。

1. 安装rpm包

```shell
# -i 　显示套件的相关信息。
# -v 　显示指令执行过程。
# -h或--hash 　套件安装时列出标记。
rpm -ivh xxx.rpm
```

2. 安装.src.rpm 软件包

```shell
$ rpm -i xxx.src.rpm
$ cd /usr/src/redhat/SPECS

# 一个和你的软件包同名的specs文件
$ rpmbuild -bp xxx.specs      
       
# 一个和你的软件包同名的目录
$ cd /usr/src/redhat/BUILD/xxx/     

# 这一步和编译普通的源码软件一样，可以加上参数
$ ./configure                        
$ make
$ make install
```

3. 卸载 rpm 软件包。

- 使用`命令 rpm -e 包名`，包名可以包含版本号等信息，但是不可以有后缀.rpm

> 有时会出现一些错误或者警告：
> ... is needed by ...
> 这说明这个软件被其他软件需要，不能随便卸载，可以`用 rpm -e --nodeps 强制卸载`。

4. 查看与 rpm 包相关的文件和其他信息。

```shell
# -a 　查询所有套件。
# -q 　使用询问模式，当遇到任何问题时，rpm指令会先询问用户。
rpm -qa # 列出所有安装过的包
```

### 9.2 yum

> yum 命令 基于 RPM 包管理，能够从`指定的服务器自动下载 RPM 包并且安装`，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。

![image](https://github.com/ITholmes/hello-world/assets/70437837/a3306347-11ce-4640-b4b8-fed2f5c287f6)

![image](https://github.com/ITholmes/hello-world/assets/70437837/a07297b4-e452-4d32-a939-9752b5bf3f6e)

替换yum源：

```shell
cp /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak

wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

yum clean all

yum makecache
```

### 9.3 apt-get 或 apt

 > apt-get 命令是 `Debian Linux 发行版中的 APT 软件包管理工具`。所有基于 Debian 的发行都使用这个包管理系统。deb 包可以把一个应用的文件包在一起，大体就如同 Windows 上的安装文件。

示例：

```shell
# 更新 apt-get
apt-get update

# 安装一个软件包
apt-get install packagename

# 卸载一个已安装的软件包（保留配置文件）
apt-get remove packagename

# 卸载一个已安装的软件包（删除配置文件）
apt-get –purge remove packagename

# 如果需要空间的话，可以让这个命令来删除你已经删掉的软件
apt-get autoclean apt

# 把安装的软件的备份也删除，不过这样不会影响软件的使用的
apt-get clean

# 更新所有已安装的软件包
apt-get upgrade

# 将系统升级到新版本
apt-get dist-upgrade
```

## 10. chown和chmod

**`chown`** (Change Owner)

**作用**: 更改文件或目录的拥有者和用户组。

```shell
sudo chown -R 1000:1000 /sypm/mount/jenkins_blueocean_1
```

**`-R`**: 递归选项

**`1000:1000`**:

- `1000` 是用户 ID（UID），表示新的文件拥有者的用户 ID。
- `1000` 是用户组 ID（GID），表示新的文件拥有者的用户组 ID。

> Tips：许多 Linux 系统上第一个非 root 用户的默认 UID 为1000，所以，一般通过非root用户启动的docker，可能需要给容器卷文件修改用户组。

`chmod` (Change Mode)

**作用**: 更改文件或目录的访问权限。

```shell
chmod -R 755 /sypm/jenkins
```

**权限模式**:

- **符号模式**: 使用 `r`（读）、`w`（写）和 `x`（执行）来设置权限。例如：
  - **`u+r`**: 给文件拥有者添加读权限。
  - **`go-w`**: 移除其他用户（组和其他人）的写权限。
- **八进制模式**: 使用数字来设置权限，每个数字代表一组权限。例如：
  - **`755`**: 读、写、执行权限（7）给拥有者，读和执行权限（5）给组和其他人。
  - **`644`**: 读和写权限（6）给拥有者，读权限（4）给组和其他人。

## 11. sed 命令
`sed` 是一个强大的流编辑器，用于在**文本文件中执行基本的文本转换**。它以逐行处理的方式读取输入文件，并根据指定的命令对内容进行处理。
```shell
sed -e ' \
s#{IMAGE_URL}#${env.HARBOR_HOST}/${env.HARBOR_LIB}/${APP_NAME}#g; \
s#{IMAGE_TAG}#${TAG}#g; \
' template.yaml > output.yaml
```
- `-e ' '`：表示多行命令。
- `s#{IMAGE_URL}#${env.HARBOR_HOST}/${env.HARBOR_LIB}/${APP_NAME}#g;`：将 {IMAGE_URL} 替换为 ${env.HARBOR_HOST}/${env.HARBOR_LIB}/${APP_NAME}。
- `>`：将输出重定向到 output.yaml。

## 12. set 命令

**`set -eux` 是一个在 Unix/Linux shell 脚本中常用的命令，用于设置 shell 的执行选项**。这些选项可以帮助你在脚本中进行更严格的错误检查和调试。以下是每个选项的作用：

- `-e`（或 `errexit`）：当命令失败时，立即退出脚本。即，如果脚本中的任何命令返回非零退出状态，脚本会立刻停止执行。这个选项可以帮助你在出现错误时快速发现问题并终止脚本执行。
- `-u`（或 `nounset`）：当脚本中使用未定义的变量时，立即退出脚本。这可以防止因为使用了未初始化的变量而导致的错误，确保脚本中所有的变量都已正确定义。
- `-x`（或 `xtrace`）：在执行每个命令之前，先将命令及其参数打印到标准错误输出。这有助于调试脚本，了解脚本的执行过程和每个命令的实际参数。

![image-20240905172848693](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240905172848693.png)



## 13. sh 命令

`sh` 是 Bourne shell 或默认的 shell，通常用于执行脚本文件。

例如：

```bash
curl -L https://istio.io/downloadIstio | sh -
```

- `curl -L https://istio.io/downloadIstio` 下载了 Istio 的安装脚本。

- `| sh -` 将该脚本直接传递给 `sh` 来执行。

## 14. export 命令

```bash
export PATH=$PWD/bin:$PATH
```



## 15. nano 命令

`nano` 是一个简单易用的文本编辑器，通常用于在命令行界面中编辑文件。

你可以使用 `nano` 命令来打开一个文件，比如：

```bash
nano filename.txt
```

这会打开 `filename.txt` 文件。如果文件不存在，它会创建一个新的文件。

进入编辑模式后，你可以直接在文件中输入文本。

保存文件：

- 按 `Ctrl + O` 来保存文件。
- `Enter` 确认文件名后保存。

退出 nano：

- 按 `Ctrl + X` 退出。
- 如果文件有未保存的修改，nano 会提示你是否保存更改。

常用快捷键：

- `Ctrl + G`：显示帮助
- `Ctrl + K`：剪切当前行
- `Ctrl + U`：粘贴
- `Ctrl + W`：查找
- `Ctrl + C`：显示光标位置

## 16. jps （JVM自带）

`jps`（Java Process Status）是 **JDK 自带的一个命令行工具**，用于 **列出当前系统中正在运行的 Java 进程**，并显示它们的 **进程 ID（PID）** 和 **主类名（或 JAR 文件名）**。

```shell
# 添加 -m 可以查看传递的参数
jps -m
60929 Kafka /opt/module/kafka/config/server.properties
60019 QuorumPeerMain /opt/module/zookeeper/bin/../conf/zoo.cfg
```

