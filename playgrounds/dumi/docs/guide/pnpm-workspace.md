---
title: workspace
order: 1
nav:
  title: 指南
  order: 1
group:
  title: pnpm
  order: 2
---

# 工作空间（Workspace）

> [pnpm workspaces docs](https://pnpm.io/zh/next/workspaces)
> [博客](https://zhuanlan.zhihu.com/p/457698236)

pnpm 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持， 你可以创建一个 workspace 以将多个项目合并到一个仓库中。

## 一、getting-started

一个 workspace 的根目录下必须有 pnpm-workspace.yaml 文件， 也可能会有 .npmrc 文件。

```bash
$ mkdir [ProjectName] && cd [ProjectName] && pnpm init

# ⛔️ 要想启动 pnpm 的 workspace 功能，需要工程根目录下存在 pnpm-workspace.yaml 配置文件，并且在 pnpm-workspace.yaml 中指定工作空间的目录
$ touch pnpm-workspace.yaml && echo "packages:" >> pnpm-workspace.yaml && echo "  - packages/*" >> pnpm-workspace.yaml
$ touch .npmrc

# 所有的子包都是放在 `packages属性包含的目录` 下
$ mkdir packages/[ProjectName] && cd packages/[ProjectName] && pnpm init
# ⛔️ 包名称通常是 "@命名空间+包名" 的方式，比如@vite/xx 或@babel/xx
```

## 二、pnpm [command] [flags]


### filter 过滤 和 excluding 排除 和 recursive 递归

```bash
# 通过该参数，允许我们将命令运用到指定的包上面，类似于jQuery跟Dom的选择器，写法如下
$ pnpm <command> --filter <package_selector>

# 同时它也支持链式调用，可以一次写多个调用，如下所示，
# 只要在开头添加一个!，过滤规则选择器都会变为排除项。
$ pnpm <command> --filter selector1 --filter selector2 --filter=!selector3

# pnpm 提供了 -r 参数，实现子包递归执行command
$ pnpm [command] -r
```
> Lerna 中也支持选择器，参数是scope，下面的文章对比了Lerna和pnpm的选择器，感兴趣的同学可以看一下
> [Lerna 与 pnpm 选择器](https://medium.com/pnpm/pnpm-vs-lerna-filtering-in-a-multi-package-repository-1f68bc644d6a)

### pnpm add

add命令是老朋友了，跟yarn add类似，安装 package 以及依赖的 package，默认是安装到dependencies中。注意的是在 workspace 中，如果想要安装在 root workspace 中需要添加-w或者--ignore-workspace-root-check，安装到 packages 中需要使用--filter，否则会安装失败

:::error
启用workspace后，直接install报错，需指定安装到何处：ERR_PNPM_ADDING_TO_ROOT  Running this command will add the dependency to the workspace root, which might not be what you want - if you really meant it, make it explicit by running this command again with the -w flag (or --workspace-root). If you don't want to see this warning anymore, you may set the ignore-workspace-root-check setting to true.
:::

```bash
# pnpm 提供了 -w, --workspace-root 参数，可以将依赖包安装到工程的根目录下，作为所有 package 的公共依赖

$ pnpm install <xxx> -w # root dependencies
$ pnpm install <xxx> -Dw # root devDependencies
```

:::info{title=常用的参数选项}
- --save-prod, -P：安装到dependencies
- --save-dev, -D：安装到devDependencies
- --save-optional, -O：安装到optionalDependencies
- --save-peer：安装到peerDependencies和devDependencies中
- --global：安装全局依赖。
- --workspace：仅添加在 workspace
  - 找到的依赖项。 安装完成后，设置依赖版本的时候推荐用 workspace:*，就可以保持依赖的版本是工作空间里最新版本，不需要每次手动更新依赖版本。
:::

### pnpm remove

别名: rm, uninstall, un

### pnpm install

别名: i, 用于安装项目所有依赖。

### pnpm prune

prune移除项目中不需要的依赖包，配置项支持 --prod(删除在 devDependencies 中指定的包)和 --no-optional(删除在 optionalDependencies 中指定的包。).

### pnpm list

别名: ls。review dependencies 查看依赖

此命令会以一个树形结构输出所有的已安装package的版本及其依赖。添加参数--json后会输出 JSON 格式的日志。

### pnpm run

别名: run-script。运行脚本

### pnpm update

根据指定的范围更新软件包的最新版本。

### [pnpm publish](https://pnpm.io/zh/cli/publish)

发布一个包到 npm registry。

## 三、发布工作流

workspace 中的包版本管理是一个复杂的任务，pnpm 目前也并未提供内置的解决方案。 不过，有两个不错且支持 pnpm 的版本控制工具可以使用：

- [changesets](https://github.com/changesets/changesets) - [文章](https://pnpm.io/zh/using-changesets)
- [Rush](https://rushjs.io/) - [文章](https://rushjs.io/pages/maintainer/setup_new_repo/)
