# Clash 简介

订阅网站：[FAST FISH](https://fast-fish.me/auth/login)

Clash 官方：[Clash](https://www.clash.la/releases/) / [Clash_CH](https://clashcn.com/clash)

# Clash开启后Git超时解决方案
有时候我们用开了clash，但还是经常出现git push显示time out的情况，并且访问网页是能够正常访问的。

这里要纠正一个很多人的误区：即使clash开了全局代理，浏览器能上GitHub等网站，git默认还是不走代理的，所以会遇到超时等情况。按照我下面的配置好之后，目前git的各项操作都畅通无阻。

![image](https://github.com/ITholmes/hello-world/assets/70437837/a9ba1690-f3c4-4984-bb8d-f8c00caf4060)

首先clash开放的是7890端口，我的git走的是https上传，但git的https却没有走这里，所以我们通过：
```powershell
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890
```

把git的代理改成clash的端口，改完了可以git config -l看看：

> 注意clash这个A要关掉，clash默认随机开放端口的，要让他固定下来，然后让git走这个端口即可。

参考：[开clash后Git依然超时的解决方法](https://zhuanlan.zhihu.com/p/652905080#:~:text=%E5%BC%80clash%E5%90%8EGit%E4%BE%9D%E7%84%B6%E8%B6%85%E6%97%B6%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95%20CodeFlow%20%E8%87%AA%E7%94%B1%E8%80%8C%E6%97%A0%E7%94%A8%E7%9A%84%E7%81%B5%E9%AD%82%20%E6%9C%89%E6%97%B6%E5%80%99%E6%88%91%E4%BB%AC%E7%94%A8%E5%BC%80%E4%BA%86clash%E6%8C%82%E5%A5%BD%E4%BA%86xx%EF%BC%8C%E4%BD%86%E8%BF%98%E6%98%AF%E7%BB%8F%E5%B8%B8%E5%87%BA%E7%8E%B0git%20push%E6%98%BE%E7%A4%BA%20time,out%20%E7%9A%84%E6%83%85%E5%86%B5%E3%80%82%20%E8%BF%99%E9%87%8C%E8%A6%81%E7%BA%A0%E6%AD%A3%E4%B8%80%E4%B8%AA%E5%BE%88%E5%A4%9A%E4%BA%BA%E7%9A%84%E8%AF%AF%E5%8C%BA%EF%BC%9A%E5%8D%B3%E4%BD%BFclash%E5%BC%80%E4%BA%86%E5%85%A8%E5%B1%80%E4%BB%A3%E7%90%86%EF%BC%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E8%83%BD%E4%B8%8A%E6%B2%B9%E7%AE%A1%E7%AD%89%E7%BD%91%E7%AB%99%EF%BC%8Cgit%E9%BB%98%E8%AE%A4%E8%BF%98%E6%98%AF%E4%B8%8D%E8%B5%B0%E4%BB%A3%E7%90%86%E7%9A%84%EF%BC%8C%E6%89%80%E4%BB%A5%E4%BC%9A%E9%81%87%E5%88%B0%E8%B6%85%E6%97%B6%E7%AD%89%E6%83%85%E5%86%B5%E3%80%82%20%E6%8C%89%E7%85%A7%E6%88%91%E4%B8%8B%E9%9D%A2%E7%9A%84%E9%85%8D%E7%BD%AE%E5%A5%BD%E4%B9%8B%E5%90%8E%EF%BC%8C%E7%9B%AE%E5%89%8Dgit%E7%9A%84%E5%90%84%E9%A1%B9%E6%93%8D%E4%BD%9C%E9%83%BD%E7%95%85%E9%80%9A%E6%97%A0%E9%98%BB%E3%80%82%20%E9%A6%96%E5%85%88%20clash%20%E5%BC%80%E6%94%BE%E7%9A%84%E6%98%AF7890%E7%AB%AF%E5%8F%A3%EF%BC%8C%E6%88%91%E7%9A%84git%E8%B5%B0%E7%9A%84%E6%98%AFhttps%E4%B8%8A%E4%BC%A0%EF%BC%8C%E4%BD%86git%E7%9A%84https%E5%8D%B4%E6%B2%A1%E6%9C%89%E8%B5%B0%E8%BF%99%E9%87%8C%EF%BC%8C%E6%89%80%E4%BB%A5%E6%88%91%E4%BB%AC%E9%80%9A%E8%BF%87%EF%BC%9A)
