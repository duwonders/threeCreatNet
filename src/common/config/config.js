'use strict';
/**
 * config
 */
export default {
    resource_on: true, //是否开启静态资源解析功能
    resource_reg: /^(upload\/|[^\/]+\.(?!ppt|doc|docx|jpeg|jpg|png|xls)\w+$)/, //判断为静态资源请求的正则
};
