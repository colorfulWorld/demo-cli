# @ecpark/im-cli

A rapid development project tool based on Vue cli.

# 安装

```
npm install @ecpark/im-cli -g
```

# Usage

Open your terminal and type `im` or `im -h` , you'll see the help infomation below:

```
  Usage: im <rapid development project tool>


  Commands:
    create [options] <app-name>         Generate a new project
    list|l                              List all the templates

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

# Commands

### create | c

you can use this command to generate a project by choose a third-party template.

```
$ im create t1
? Are you want to install echart?(Y/N)

√ Downloading template...
√ The object has installed dependence successfully!
```

### list | l

It shows you the templates list.

```
$ im list

┌───────────────┬──────────┬───────────────────────────────────────────┐
│ Template Name │ Branch   │ Url                                       │
├───────────────┼──────────┼───────────────────────────────────────────┤
│ template1     │ master   │ http://git.ym/g-web/im-cli-template.git   │
└───────────────┴──────────┴───────────────────────────────────────────┘
```

# Template

The most important part of im is `template`. The official template information is listed in templates.json, and the third-party templates are listed in remote-templates.json.A template means a project sample, which has a simple or complex file structure.

You can create your own templates repository, and push your templates in different branches. All you need to do then is to add the templates into im's `templates.json`.

# Env and dependencies

- node
- @vue/cli ~3
- Vuex
- Vuex
- VueRouter
- vant
- axios

# License

MIT.
