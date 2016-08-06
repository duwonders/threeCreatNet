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
}