interface Res {
    msg: string;
    flag: number;
  }
  
  namespace APIType {
    /**
     * 登录
     */
    export type loginParam = {
      /**
       * 用户名
       */
      username: string;
  
      /**
       * 密码
       */
      password: string;
      /**
       * 类型
       */
      scope: string;
      /**
       * 租户id
       */
      tenantId: number
    };
  
    /**
     * 登录
     */
    export type loginRes = {
      /**
       * 返回session Id
       */
      obj: Record<string, any>;
    } & Res;
  
    /**
     * 获取省市区数据
     */
    export type getAreaBaseInfoRes = {
      /**
       * 返回省市区数据
       */
      obj: {
        list: {
          name: string;
          code: string;
          id: number;
          list: {
            name: string;
            code: string;
            id: number;
            provinceCode: string;
            list: {
              name: string;
              code: string;
              id: number;
              cityCode: string;
            }[]
          }[]
        }[]
      };
    } & Res;
  }
  
  export default APIType;