# nvm

## 1. nvm安装

官方地址：[https://github.com/nvm-sh/nvm/blob/master/README.md](https://github.com/nvm-sh/nvm/blob/master/README.md)

- nvm window安装：[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

看个人习惯，通过不同形式来安装nvm，省劲就用.exe安装即可。

> 注意 Tips：安装之前，要卸载当前系统的nodejs。

在 cmd 命令框中，输入 `nvm version` 显示nvm版本信息表示安装成功。

## 2. nvm配置

nvm安装目录下面有一个 `settings.txt` 文件，该文件是配置文件：

```txt
# 配置根目录
root: D:\env\nvm\nvm
# 配置nodejs安装路径
path: D:\env\nvm\nodejs

# 配置镜像：(失败了，0.0 貌似淘宝镜像地址变了，去查查就行)
## node 淘宝镜像
node_mirror: https://npm.taobao.org/mirrors/node/  
## npm 淘宝镜像
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

## 3. nvm命令

```powershell
# 1.显示已安装的Node.js版本列表。
nvm list
# 2.安装指定版本的Node.js。例如，nvm install 14.17.0，将安装Node.js 14.17.0版本。
nvm install <Node version>
# 3.卸载指定版本的Node.js。
nvm uninstall <Node version>
# 4.切换到指定版本的Node.js。例如，nvm use 14.17.0，将切换到Node.js 14.17.0版本。
nvm use <Node version>
# 5.显示当前正在使用的Node.js版本。
nvm current
# 6.列出所有已安装的Node.js版本，与nvm list命令功能相同。
nvm ls
# 7.为指定的Node.js版本创建别名。例如，nvm alias default 14.17.0将把14.17.0版本设置为默认版本。
nvm alias <name> <Node version>
# 8.删除指定的别名。
nvm unalias <name>
# 9.显示或设置NVM的根目录。如果不指定路径，将显示当前根目录的路径。
nvm root [path]
# 10.显示NVM自身的版本信息。
nvm version
# 11.开启node.js版本管理。
nvm on
# 12.关闭node.js版本管理。
nvm off
# 13.表⽰node是运⾏在32位还是64位。
nvm arch
# 14.命令形式：添加node和npm镜像
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

知道上面的命令就差不多了。