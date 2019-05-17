"use strict";
require("./check-versions")();

process.env.NODE_ENV = "production";

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const config = require("../config");
const webpackConfig = require("./webpack.prod.conf");

/* --------------------------------------------------文件自动打包zip 开始--------------------------------------------------- */
var autoArchiver = () => {
    let archiver = require("archiver");
    let fs = require("fs");
    console.time("文件压缩成功，共计用时：");
    // 创建文件输出流
    let output = fs.createWriteStream(
        path.resolve(__dirname, "../dist/nms") + timeStramp() + ".zip"
    );
    let archive = archiver("zip", {
        zlib: { level: 9 } // 设置压缩级别
    });
    // 文件输出流结束
    output.on("close", function() {
        console.timeEnd("文件压缩成功，共计用时：");
        console.log(chalk.green(`压缩后文件大小共 ${archive.pointer()} 字节 \n`));
    });
    // 数据源是否耗尽
    output.on("end", function() {
        console.log("数据源已耗尽");
    });
    // 存档警告
    archive.on("warning", function(err) {
        if (err.code === "ENOENT") {
            console.warn("路径名中的目录不存在或是无效的符号连接");
        } else {
            throw err;
        }
    });
    // 存档出错
    archive.on("error", function(err) {
        throw err;
    });
    // 通过管道方法将输出流存档到文件
    archive.pipe(output);
    // 从流中附加文件
    let index = path.resolve(__dirname, "../dist/index.html");
    archive.append(fs.createReadStream(index), { name: "index.html" });
    // 从子目录追加文件并将其命名为“新子dir”在存档中
    archive.directory(path.resolve(__dirname, "../dist/static"), "static");
    // 完成归档
    archive.finalize();
};

function timeStramp() {
    var now = new Date();
    return `${now.getFullYear()}-${now.getMonth() +
        1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
}
/* --------------------------------------------自动打包zip 结束-------------------------------------------------*/

const spinner = ora("building for production...");
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err;
    webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(
            stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: false
            }) + "\n\n"
        );

        if (stats.hasErrors()) {
            console.log(chalk.red("  Build failed with errors.\n"));
            process.exit(1);
        }

        console.log(chalk.cyan("  Build complete.\n"));
        console.log(
            chalk.yellow(
                "  Tip: built files are meant to be served over an HTTP server.\n" +
                    "  Opening index.html over file:// won't work.\n"
            )
        );
        autoArchiver();
    });
});
