import QS from "qs";
import axios from "./apiConfig";
import GPS from "@/assets/js/GPS";
import axiosJsonp from "axios-jsonp";
import baseURL from "./baseUrl";
import store from "@/store/index";
import { clearDataTrim } from "../utils/index";

const handleApiFn = (data: any) => {
  if (data.code === undefined) {
    return Promise.resolve(data);
  }

  if (data.code === 0) {
    return Promise.resolve(data);
  }

  return Promise.reject(data);
}


const handleLbsMulti = (msg:string)=>{
  return Promise.resolve(msg);
}

const handleReject = (err: any) => Promise.reject(err.status ? { msg: err.data.msg } : { msg: "网络异常" });

export async function GET(url: string, params?: any) {
  try {
    // 过滤空格
    let clearTrim = clearDataTrim(params);
    const { data } = await axios.get(url, { params:clearTrim });
    return handleApiFn(data);
  } catch (error) {
    return handleReject(error);
  }
}

export async function POST(url: string, params: any) {
  try {
    // 过滤空格
    let clearTrim = clearDataTrim(params);
    const { data } = await axios.post(url, QS.stringify(clearTrim));
    return handleApiFn(data);
  } catch (error) {
    return handleReject(error);
  }
}

export async function POSTBody(url: string, params: any) {
  try {
    const { data } = await axios({
      url,
      data: clearDataTrim(params),  // 过滤空格
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return handleApiFn(data);
  } catch (error) {
    return handleReject(error);
  }
}

export async function FORM(url: string, params: any) {
  try {
    const formData = new window.FormData();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        formData.append(key, value);
      })
    }

    const { data } = await axios({
      url,
      data: formData,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return handleApiFn(data);
  } catch (error) {
    return handleReject(error);
  }
}

export async function UPLOADFILE(url: string, params: any) {
  try {
    const { data } = await axios({
      url,
      data: params,
      method: "post"
    });
    return handleApiFn(data);
  } catch (error) {
    return handleReject(error);
  }
}

export async function JSONP(url: string, params: any) {
  try {
    const data = await axios({
      adapter: axiosJsonp,
      url,
      params,
      method: "get"
    });
    return handleApiFn(data.data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function lbsMultiFn(url: string, params: any) {
  try {
    const data = await axios({
      adapter: axiosJsonp,
      url,
      params,
      method: "get"
    });
    return handleLbsMulti(data.data);
  } catch (err) {
    return handleLbsMulti(err);
  }
}
// export function exportFile(json: string, params: object){
//   axios({
//     method: 'GET',
//     url: `http://47.106.47.148:9999/car/v1/api/renew/exportVehicleExpire.json?offlineTimeBegin=0&offlineTimeEnd=0&isState=&vehicleState=&installDateStart=&installDateEnd=&groupId=&vehicleId=&activationTmeStart=&activationTmeEnd=&displayYear=0&expireTime=2678400&pageNumber=1&pageSize=40&sessionId=2b7ad8caf6144883a4b5670ffc9de9f7`,
//     responseType: 'blob'
//   }).then((res) => {
//       const link = document.createElement('a')
//       let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
//       link.style.display
//        = 'none'
//       link.href = URL.createObjectURL(blob);
//       console.log(res);
//       link.download = '下载名称';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//   }).catch(error => {
//       console.log(error);
//   })
// }



/**
 * @desc   下载文件
 * @param  {String} baseUrl
 * @param  {Object} params
 */
export function exportFile(json: string, params: object) {
  // 处理baseUrl
  const baseUrl = process.env.NODE_ENV === "development" ? baseURL : baseURL;
  const lastIndex = baseUrl.length - 1;
  const newBaseUrl = baseUrl[lastIndex] === "/" ? baseUrl.slice(0, lastIndex) : baseUrl;
  // 处理json
  const newJson = json[0] === "/" ? json.slice(1) : json;
  // 处理参数
  const arr = Object.entries(params).map(([key, val]) => `${key}=${val}`);
  // 添加session_id
  arr.push("sessionId=" + store.state.sessionId);
  // 生成url
  let url = `${newBaseUrl}/${newJson}?${arr.join("&")}`;
  if(newJson.slice(0, 4) === "http"){
    url = newJson;
  }
  const elemIF = document.createElement("iframe");
  elemIF.src = url;
  elemIF.style.display = "none";
  document.body.appendChild(elemIF);
}

type addressList = { address: string; tag: number }[];

// 请求地址hash缓存
const addressHash: Map<string, string> = new Map();

/**
 * @desc 将请求数组切割成50一份 分批获取地址
 * @param {Array} list
 * @return {Promise}
 */

export async function GetGeo(
  LocationList: {
    lat: number;
    lon: number;
    tag?: number;
  }[],
  /**
   * 是否需要纠偏
   */
  change = true
): Promise<addressList> {
  // 缓存过多则清除防止溢出
  if (addressHash.size > 1000) {
    addressHash.clear();
  }
  // 下标与经纬度的映射
  const tagToLonLat: Map<number, string> = new Map();

  const canGetLocals = LocationList.reduce(
    (
      acc: {
        lat: number;
        lon: number;
        tag: number;
      }[],
      item,
      index
    ) => {
      if (addressHash.has(`${item.lon}_${item.lat}`)) return acc;
      let lon = item.lon;
      let lat = item.lat;
      if (change) {
        const res = GPS.gcj_encrypt(item.lat, item.lon);
        lon = res.lon;
        lat = res.lat;
      }
      const tag = item.tag === undefined ? index : item.tag;
      tagToLonLat.set(tag, `${item.lon}_${item.lat}`);
      return acc.concat([
        {
          lon,
          lat,
          tag
        }
      ]);
    },
    []
  );

  const chunks: typeof canGetLocals[] = []; // 数组切割成50一组的数组
  for (let i = 0; i < canGetLocals.length; i += 50) {
    chunks.push(canGetLocals.slice(i, i + 50));
  }
  if (chunks.length) {
    const result = await Promise.all(chunks.map(chunk => getLocal(chunk)));
    result
      .reduce((acc, item) => acc.concat(item))
      .forEach(({ tag, address }) => {
        const lonLatKey = tagToLonLat.get(Number(tag))!;
        addressHash.set(lonLatKey, address);
      });
  }

  return LocationList.map((item, index) => {
    const tag = item.tag === undefined ? index : item.tag;
    return {
      tag,
      address: addressHash.get(`${item.lon}_${item.lat}`)!
    };
  });
}



/**
 * @desc 获取地址 {lat,lon,tag}  经,纬,下标
 * @param {Array} list
 * @return {Promise}
 */
async function getLocal(posList: any[]): Promise<addressList> {
  try {
    const { obj } = await JSONP("https://lbsserver.car900.com/geo/GetGeo.json", {
      param: JSON.stringify({ posList })
    });

    if (obj != null && obj.length > 0) {
      const addressList: addressList = [];
      obj.map((item: { regeocode: { roads: string | any[]; formatted_address: string; }; tag: any; }) => {
        if (item.regeocode) {
          let address = "";
          if (item.regeocode.roads.length > 0) {
            address = formatDisplayRow(item);
            // const road = item.regeocode.roads[0];
            // address = `${item.regeocode.formatted_address}(在${road.name}的${road.direction
            //   }方向约${parseInt(road.distance)}米)`;
          } else {
            address = item.regeocode.formatted_address;
          }

          addressList.push({
            address,
            tag: item.tag
          });
        } else {
          addressList.push({
            address: "获取位置失败",
            tag: item.tag
          });
        }
      });
      return Promise.resolve(
        addressList.map(item => ({
          ...item,
          address: item.address === "[]" ? "获取位置失败" : item.address
        }))
      );
    }

    const addressList = posList.map((item: any) => ({
      ...item,
      address: "获取位置失败"
    }));
    return Promise.resolve(addressList);
  } catch (error) {
    console.error(error);
    const addressList = posList.map((item: any) => ({
      ...item,
      address: "获取位置失败"
    }));
    return Promise.resolve(addressList);
  }
}

/**
 * 格式化显示地址格式
 */
function formatDisplayRow(itemData: any) {
  let result = "";
  if (itemData.regeocode) {
    result = itemData.regeocode.formatted_address;
    itemData.regeocode.roads.map((roadItem: any, roadIndex: number) => {
      if (roadIndex === 0) {
        result += " (";
      } else {
        result += " ";
      }
      result +=
        "在" +
        roadItem.name +
        "的" +
        roadItem.direction +
        "方向约" +
        Math.floor(roadItem.distance) +
        "米";

      if (roadIndex === itemData.regeocode.roads.length - 1) {
        result += ")";
      }
    });
  } else {
    result = "获取地址失败";
  }
  return result
}