// 动画效果
const ora = require('ora')
// 字体加颜色
const chalk = require('chalk')
//问题交互
const { prompt } = require('inquirer')
// 显示提示图标
const symbols = require('log-symbols')
// 填充信息至文件
const handlebars = require('handlebars')
//下载模板
const download = require('download-git-repo')
// node 文件模块 fs-extra是fs的一个扩展，提供了非常多的便利API，并且继承了fs所有方法和为fs方法添加了promise的支持。
const fs = require('fs-extra')
// 命令行操作
var shell = require('shelljs')
// 是否是有效的npm 包名称。
const validateProjectName = require('validate-npm-package-name')

let tplList = require(`${__dirname}/../repository/templates`)

async function create(projectName) {
  //校验npm项目名字
  const result = validateProjectName(projectName)
  const inCurrent = projectName === '.'
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`))
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim('Error: ' + err))
      })
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim('Warning: ' + warn))
      })
    process.exit()
  }

  if (fs.existsSync(projectName)) {
    if (inCurrent) {
      const { ok } = await prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`,
        },
      ])
      if (!ok) {
        return
      }
    } else {
      const { action } = await prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(
            projectName
          )} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false },
          ],
        },
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(projectName)}...`)
        await fs.remove(projectName)
      }
    }
  }
  const { echart } = await prompt([
    {
      type: 'confirm',
      name: 'echart',
      message: 'Are you want to install echart?(Y/N)',
      default: true,
    },
  ])
  if (!echart) {
    downloadDepend(false, projectName)
  } else {
    downloadDepend(true, projectName)
  }
}

function downloadDepend(isInitEchart, projectName) {
  const spinner = ora('Downloading template...')
  spinner.start()
  download(
    `direct:${tplList['template1']['url']}#${tplList['template1']['branch']}`,
    `./${projectName}`,
    { clone: true },
    (err) => {
      if (err) {
        spinner.fail()
        console.log(symbols.error, chalk.red(err))
      } else {
        spinner.succeed()
        const fileName = `${projectName}/package.json`

        const meta = {
          name: projectName,
        }
        console.log(fileName)
        if (fs.existsSync(fileName)) {
          console.log('come in...')
          const content = fs.readFileSync(fileName, 'utf8')
          const c = JSON.parse(content) // 将文件解析成对象
          if (isInitEchart) {
            //若是安装echart
            c.dependencies['echart'] = '^0.1.3'
          }
          const result = handlebars.compile(JSON.stringify(c, null, 2))(meta)
          fs.writeFileSync(fileName, result)
          //主动安装相关依赖
          shell.cd(meta.name)
          shell.exec('npm i', function (err, stdout, stderr) {
            if (err) {
              spinner.fail()
              console.log(symbols.error, chalk.red(err))
            } else {
              spinner.succeed()
              console.log(
                symbols.success,
                chalk.green('The object has installed dependence successfully!')
              )
            }
          })
        }
      }
    }
  )
}
module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log(err)
  })
}
