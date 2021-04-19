
/**
 * im-cli 控制台logo
 */

// 获取包中文字
const figlet = require('figlet');
function figletStr(){
    return figlet.textSync('im-cli', {
        font: 'Isometric1',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    });
}

exports.figletStr = figletStr;