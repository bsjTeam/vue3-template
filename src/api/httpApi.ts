import url from "./url";
import { POST, GET, exportFile, POSTBody,JSONP,lbsMultiFn} from "./apiFn";
import APIType from "./type";

export default {
  /**
   * 登录
   */
  login: (params: APIType.loginParam): Promise<APIType.loginRes> =>
    POST(url.login, params),

}