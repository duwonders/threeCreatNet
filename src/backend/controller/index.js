'use strict';

import Base from './base.js';

import fs from 'fs';
import path from 'path'

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
  uploadAction (){
    this.setCorsHeader();
    // 设置允许外部 请求

    //这里的 key 需要和 form 表单里的 name 值保持一致
    let file = think.extend({}, this.file('image'));

    let filepath = file.path;

    //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
    let uploadPath = think.RESOURCE_PATH + '/upload';
    think.mkdir(uploadPath);
    
    let basename = path.basename(filepath);
    fs.renameSync(filepath, uploadPath + '/' + basename);

    file.path = uploadPath + '/' + basename;

    if(think.isFile(file.path)){
      console.log(basename);
    }else{
      console.log("Failed");
    }

    this.assign('fileInfo', file);
    this.success(basename);
    //  this.suceess 用来返回值 vue 中 post().then 接收 返回链接
  }
  setCorsHeader(){ this.header("Access-Control-Allow-Origin", this.header("origin") || "*"); this.header("Access-Control-Allow-Headers", "x-requested-with"); this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE"); this.header("Access-Control-Allow-Credentials", "true");
    //  设置 header
  }
}