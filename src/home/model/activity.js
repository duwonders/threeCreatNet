'use strict';
/**
 * model
 */
export default class extends think.model.base {
	async get_hd_by_type(type){
		let table_hd = this.model("hd");
		let data = await table_hd.where({
			hd_type: type,
		}).order('hd_time DESC').select();
		return data;
	} 
}