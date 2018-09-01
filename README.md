# 1-click
sample lambda functions for AWS 1-click service

# 準備
[apex](http://apex.run/) を使います。apex がインストールされてない場合には、

```
curl https://raw.githubusercontent.com/apex/apex/master/install.sh | sh
```

としてインストールして下さい。環境によっては sudo が必要かもしれません。

# 設置

```
~$ git clone https://github.com/j3tm0t0/1-click.git
Cloning into '1-click'...
remote: Counting objects: 14, done.
remote: Compressing objects: 100% (10/10), done.
remote: Total 14 (delta 2), reused 10 (delta 2), pack-reused 0
Unpacking objects: 100% (14/14), done.
~$ cd 1-click
~/1-click$ apex init


             _    ____  _______  __
            / \  |  _ \| ____\ \/ /
           / _ \ | |_) |  _|  \  /
          / ___ \|  __/| |___ /  \
         /_/   \_\_|   |_____/_/\_\



  Enter the name of your project. It should be machine-friendly, as this
  is used to prefix your functions in Lambda.

    Project name: 1-click

  Enter an optional description of your project.

    Project description: sample lambda functions for AWS 1-click service

  [+] creating IAM 1-click_lambda_function role
  [+] creating IAM 1-click_lambda_logs policy
  [+] attaching policy to lambda_function role.
  [+] creating ./project.json
  [+] creating ./functions

  Setup complete, deploy those functions!

    $ apex deploy
~/1-click$ rm -r functions/hello # 不要なサンプルコードを削除
~/1-click$ apex deploy
   • creating function         env= function=ifttt
   • created alias current     env= function=ifttt version=1
   • function created          env= function=ifttt name=1-click_ifttt version=1
```

# 使い方
それぞれの function の README を参照して下さい
- [ifttt連携](functions/ifttt)
