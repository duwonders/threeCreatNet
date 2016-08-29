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
  uploadimgAction (){
    this.setCorsHeader();

    let file = think.extend({}, this.file('image'));
    /*
    *   think.extend(目录对象, 原对象)
    *   this.file(name) 传入的值是 form 表单中 <input type="file"> 的 name 属性
    */

    /*
    *   console.log(file);
    *
    *   {
    *       fieldName: 'image',
    *       originalFilename: '论语.docx',
    *       path: '/Users/macbookair/Desktop/threeCreatNet/runtime/upload/0sTsLzTH09vRA9HAZZLwnuER.docx',
    *       headers:
    *           {
    *               'content-disposition': 'form-data; name="image"; filename="论语.docx"',
    *               'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    *           },
    *       size: 14179
    *   }
    */

    let filepath = file.path;
    let originalFilename = file.originalFilename;
    let suffix = (originalFilename.split('.')).pop();
    let uploadPath = think.RESOURCE_PATH + '/upload';

    if (/(jpg|png|jpeg|gif)/.test(suffix)) {
        uploadPath = `${uploadPath}/img`;
    } else if (/(ppt|pptx|pp*|key)/.test(suffix)) {
        uploadPath = `${uploadPath}/ppt`;
    } else if (/(doc|docx|do*)/.test(suffix)) {
        uploadPath = `${uploadPath}/word`;
    } else if (/(xls|xlsx|xl*)/.test(suffix)) {
        uploadPath = `${uploadPath}/excel`;
    } else {
        uploadPath = `${uploadPath}/other`;
    }
    /*
    *   文件上传之后会先放到 runtime 目录下作为缓存
    *   如果不继续对文件进行处理，保存到自定目录下的话，缓存会清除，文件不会保留
    */

    think.mkdir(uploadPath);

    // let basename = path.basename(filepath);
    /**
     *  basename 是哈希之后的名字
     *  此处使用原文件名 所以暂时不用 basename
     *  若需要使用 则将下方 originalFilename 全部替换为 basename 即可
     */

    fs.renameSync(filepath, uploadPath + '/' + originalFilename);
    file.path = uploadPath + '/' + originalFilename;
    /*
    *   创建指定文件夹
    *   basename 文件上传后的名称
    *   fs.renameSync 异步改文件名，待文件上传之后把文件的路径变一下，就能看到文件实体了 = =
    */

    this.assign('fileInfo', file);
    this.success({
        prevName: file.originalFilename,
        currName: originalFilename
    });
    /*
    *   然后等上线了 后端改一下 currName 字段 返回 URL
    */
  }
  /* 相册上传图片接口 */

  setCorsHeader(){
      this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
      this.header("Access-Control-Allow-Headers", "x-requested-with");
      this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
      this.header("Access-Control-Allow-Credentials", "true");
  }
  /*
  *  设置允许请求的 header
  *  调试不同端口用
  */

  /* 下面是数据库操作 */

  /*
  * gallery 页面
  *    |
  *    |----album 路由(/gallery/album)
  *    |
  *    |----image 路由(/gallery/image)
  */
  async getpicAction(){
    this.setCorsHeader();

    let json = this.post();
    let data = await this.model('picture').page([json.currentPage, 5]).order("id DESC").countSelect();
    //  分页的查询 .page([现页数， 总页数])

    console.log("获取图片列表 data");
    return this.success(data);
  }
  /* 获取图片的信息 */

  async postpicAction(){
    this.setCorsHeader();

    let json = this.post();
    let picture = this.model('picture');
    let album = this.model('album');
    let isAlbumExist = await album
        .where({id: json.album_id})
        .find();
    if (!think.isEmpty(isAlbumExist)) {
        let set_album_pages = parseInt(isAlbumExist.album_pages) + 1;
        let affactedRows = await album
            .where({id: json.album_id})
            .update({album_pages: set_album_pages});
        let retData = await picture.add(json);
        return this.success(retData);
    } else {
        console.log("查询了一个不存在的图片 ID ");
        return this.success("");
    }
    /*
    *   相册表 图片表 都需要操作
    *   上传图片的时候保证需要上传到的相册 id 是存在的
    *   上传成功 图库中的图片数量 + 1
    *   批量添加等会再说 = =
    * */
  }
  /* 上传图片信息 */

  async deletesingleimgAction () {
      this.setCorsHeader();

      let pic_id_obj = this.post();
      let picture = this.model('picture');
      let album = this.model('album');
      let album_id = (await picture.where(pic_id_obj).find()).album_id;
      let set_album_pages = (await album.where({id: album_id}).find()).album_pages - 1;
      let affectedRows = await album
          .where({id: album_id})
          .update({album_pages: set_album_pages});
      let retData = await picture.where({id: ["=", pic_id_obj.id]}).delete();
      return this.success(retData);
      /*
      *  单张删除图片
      *  不用判断 因为相册 id 肯定是存在的
      *  删除图片之后要将对应图库中的图片数量 - 1
      * */
  }
  /* 删除单张图片信息 */

  async updatesingleimgAction () {
      this.setCorsHeader();

      let data = this.post();
      let model = this.model('picture');
      let retData = await model.where({id: data.id}).update({
         album_id: data.album_id,
         pic_name: data.pic_name,
         pic_url: data.pic_url
      });
      return this.success(retData);
  }
  /* 更新单张图片信息 */

  async getalbumAction(){
    this.setCorsHeader();

    let json = this.post();
    let data = await this.model('album')
                .page([json.currentPage, 5])
                .order("id DESC").countSelect();
    return this.success(data);
  }
  /* 获取相册的信息 */

  async postalbumAction(){
    this.setCorsHeader();

    let json = this.post();
    let model = this.model('album');
    let retData = await model.add(json);
    return this.success(retData);
  }
  /* 上传相册信息 */

  async deletesinglealbumAction () {
      this.setCorsHeader();

      let album_id_obj = this.post();
      let album = this.model('album');
      let picture = this.model('picture');
      let affectedRows = await picture.where({album_id: ["=", album_id_obj.id]}).delete();
      let retData = await album.where({id: ["=", album_id_obj.id]}).delete();
      return this.success(retData);
      /*
      *  删除相册的时候 把相册中图片的对应关系也一并删除
      *  当然图片文件还是在里面的
      */
  }
  /* 删除相册 */

  async updatesinglealbumAction () {
      this.setCorsHeader();

      let data = this.post();
      let model = this.model('album');
      let retData = await model.where({id: data.id}).update({
         album_name: data.album_name,
         album_cover: data.album_cover
      });
      return this.success(retData);
  }
  /* 更新相册信息 */
  async detailbyidAction () {
      this.setCorsHeader();

      let data = this.post();
      let picture = this.model('picture');
      let retData = await picture.where({album_id: ["=", data.id]}).countSelect();

      return this.success(retData);
  }


  /*
  *  Activity 页面
  *     |
  *     |----list
  *     |----live
  */

  async getactivitylistAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let hd = this.model('hd');
        let data = {};

        if (req_obj.selected == 0) {
            data = await hd.page([req_obj.currentPage, 5])
                        .order("id DESC").countSelect();
        } else {
            data = await hd.where({hd_type: req_obj.selected})
                            .page([req_obj.currentPage, 5])
                            .order("id DESC").countSelect();
        }

        return this.success(data);
  }
  /* 获取活动列表 */

  async getsingleactivityAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let hd = this.model('hd');
      let related = this.model('related');

      let data = await hd.where({id: req_obj.hd_id}).find();

      return this.success(data);
  }
  /* 根据活动 id 获取对应活动信息 */

  async getlinksAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let related = this.model('related');
      let data = await related.where({activity_id: req_obj.hd_id}).select();

      return this.success(data);
  }
  /* 根据活动 id 获取相关链接 */

  async submitlinksAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let related = this.model('related');
      let arr = JSON.parse(req_obj.data).arr;
      let res_data;

      console.log(arr);

      if (arr.length != 0) {
          arr = (() => {
            let count = 0;
            arr.map((item, index) => {
              if (item.id >= 0) {
                count++;
              } else {
                delete(item.id);
              }
            });
            arr.splice(0, count);
            return arr;
          })(arr);
          if (arr.length != 0) {
              res_data = await related.addMany(arr);
          } else {
            res_data = true;
          }
      } else {
          res_data = true;
      }

      return this.success(res_data);

  }
  /* 根据活动 id 获取相关链接 */

  async createactivityAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let hd = this.model('hd');
      let ret_data = await hd.add(req_obj);

      return this.success(ret_data);
  }
  /* 创建新的活动 */

  async updateactivityAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let hd = this.model('hd');
      let ret_data = await hd.where({id: req_obj.id}).update(req_obj);

      return this.success(ret_data);
  }
  /* 更新活动信息 */

  async deleteactivityAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let hd = this.model('hd');
      let related = this.model('related');

      let affectedRows = await hd.where({id: ["=", req_obj.id]}).delete();
      let rows = await related.where({activity_id: ["=", req_obj.id]}).delete();

      this.success(affectedRows);
  }
  /* 删除活动 */

  async getlivelistAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let direct = this.model('direct');
        let ret_data = await direct.page([req_obj.currentPage, 5])
                        .order("id DESC").countSelect();

        return this.success(ret_data);
  }
  /* 获取直播内容列表 */

  async postliveAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let direct = this.model('direct');
        let ret_data = await direct.add(req_obj);

        return this.success(ret_data);
  }
  /* post 新的直播内容 */

  async deleteliveAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let direct = this.model('direct');
        let ret_data = await direct.where({id: ["=", req_obj.id]}).delete();

        return this.success(ret_data);
  }
  /* 删除直播内容 */

  async updateliveAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let direct = this.model('direct');
        let ret_data = await direct.where({id: req_obj.id}).update(req_obj);

        return this.success(ret_data);
  }
  /* 更新直播内容 */

  async startliveAction () {
      this.setCorsHeader();

      let direct = this.model('direct');
      let req_data = await direct.execute(`Truncate direct`);

      this.success(req_data);
  }

  /*
  *  Sayings 页面
  *     |
  *     |----list
  *     |----detail
  */

  async getarticlelistAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let article = this.model('article');
        let data = await article.page([req_obj.currentPage, 5])
                    .order("id DESC").countSelect();

        return this.success(data);
  }
  /* 获取文章列表 */

  async deletearticleAction () {
        this.setCorsHeader();

        let req_obj = this.post();
        let article = this.model('article');
        let ret_data = await article.where({id: ["=", req_obj.id]}).delete();

        return this.success(ret_data);
  }
  /* 删除文章内容 */

  async getsinglearticleAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let article = this.model('article');
      let data = await article.where({id: req_obj.atc_id}).find();

      return this.success(data);
  }
  /* 根据文章 id 获取对应文章信息 */

  async updatearticleAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let article = this.model('article');
      let ret_data = await article.where({id: req_obj.id}).update(req_obj);

      return this.success(ret_data);
  }
  /* 更新文章信息 */

  async createarticleAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let article = this.model('article');
      let ret_data = await article.add(req_obj);

      return this.success(ret_data);
  }
  /* 创建新的活动 */


  /*
  *  Download 页面
  *     |
  *     |----list
  *     |----upload
  */

  async getfilelistAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let download = this.model('download');
      let ret_data = await download.page([req_obj.currentPage, 5])
                        .order("id DESC").countSelect();

      return this.success(ret_data);
  }
  /* 获取文件列表信息 */

  async deletefileAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let download = this.model('download');
      let ret_data = await download.where({id: ["=", req_obj.id]}).delete();

      return this.success(ret_data);
  }
  /* 删除文件信息 */

  async updatefileAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let download = this.model('download');

      let ret_data = await download.where({id: ["=", req_obj.id]}).update({
          file_title: req_obj.file_title,
          file_url: req_obj.file_url
      });

      return this.success(ret_data);
  }
  /* 更新文件信息 */

  async postfileAction(){
    this.setCorsHeader();

    let json = this.post();
    let download = this.model('download');
    let retData = await download.add(json);

    return this.success(retData);
  }
  /* 上传文件信息 */

  /*
  *  Slider 页面
  */

  async getsliderlistAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let slider = this.model('slider');
      let home = await slider.where({type: 'home'}).select();
      let activity = await slider.where({type: 'activity'}).select();
      let ret_data = {
          home: home,
          activity: activity
      }

      return this.success(ret_data);
  }
  //    获取链接列表

  async updatesliderlistAction () {
      this.setCorsHeader();

      let req_obj = this.post();
      let slider = this.model('slider');
      let home = JSON.parse(req_obj.home);
      let activity = JSON.parse(req_obj.activity);

      let req_data = await slider.execute(`Truncate slider`);
      req_data = await slider.addMany(home);
      req_data = await slider.addMany(activity);

      return this.success(req_data);
  }
  //    更新链接列表
}
