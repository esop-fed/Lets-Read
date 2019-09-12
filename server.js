require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
let chalk = require('chalk');
const config = require('./webpack.config');

const DefaultPort = process.env.PORT || 8888;

/**
 * Flag indicating whether webpack compiled for the first time.
 * @type {boolean}
 */
let isInitialCompilation = true;
let processEnv = {};
const compiler = webpack(config);

new WebpackDevServer(compiler, config.devServer).listen(DefaultPort, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    processEnv = process.env;
});

compiler.plugin('done', () => {
    if (isInitialCompilation) {
        // set app proxy
        // spawn('npm', ['run', 'proxy'], { shell: true, env: process.env, stdio: 'inherit' })
        //     .on('close', code => process.exit(code))
        //     .on('error', spawnError => console.error(spawnError));
        // console.log('Listening at localhost:' + PORT.devServer);

        setTimeout(() => {
            console.log(chalk.green.bold('\n✓ The bundle is now ready for serving!\n'));
            console.log(chalk.magenta.bold('  remote address:'), chalk.yellow.bold('http://' + getIPAddress() + ':' + DefaultPort));
            console.log(chalk.magenta.bold('  local address:'), chalk.yellow.bold('http://localhost:' + DefaultPort + '/\n'));
            console.log(`  ${chalk.yellow.bold('HMR is active. The bundle will automatically rebuild and live-update on changes.')}`);
            buddhaBless();
        }, 400);
    }
    isInitialCompilation = false;
});

// 本地IP地址
function getIPAddress() {
    const interfaces = require('os').networkInterfaces();
    let IPAddress = '';

    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === 'IPv4' &&
                alias.address !== '127.0.0.1' &&
                !alias.internal
            ) {
                IPAddress = alias.address;
            }
        }
    }

    return IPAddress;
}


function buddhaBless() {
    console.log([
        "                   _ooOoo_",
        "                  o8888888o",
        "                  88\" . \"88",
        "                  (| -_- |)",
        "                  O\\  =  /O",
        "               ____/`---'\\____",
        "             .'  \\\\|     |//  `.",
        "            /  \\\\|||  :  |||//  \\",
        "           /  _||||| -:- |||||-  \\",
        "           |   | \\\\\\  -  /// |   |",
        "           | \\_|  ''\\---/''  |   |",
        "           \\  .-\\__  `-`  ___/-. /",
        "         ___`. .'  /--.--\\  `. . __",
        "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
        "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
        "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
        "======`-.____`-.___\\_____/___.-`____.-'======",
        "                   `=---='",
        "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "           佛祖镇楼       BUG辟易",
        "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        // "     佛曰:  ",
        // "         写字楼里写字间，写字间里程序员；  ",
        // "         程序人员写程序，又拿程序换酒钱。  ",
        // "         酒醒只在网上坐，酒醉还来网下眠；  ",
        // "         酒醉酒醒日复日，网上网下年复年。  ",
        // "         但愿老死电脑间，不愿鞠躬老板前；  ",
        // "         奔驰宝马贵者趣，公交自行程序员。  ",
        // "         别人笑我忒疯癫，我笑自己命太贱；  ",
        // "         不见满街漂亮妹，哪个归得程序员？"
    ].join('\n'));
}

