import { format } from 'fecha';

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export default {
    log(obj) {
        console.log(JSON.stringify(obj))
    },
    random(num) {
        return Math.floor(Math.random() * num);
    },
    findIdxInArr(arr, key, val) {
        let idx = -1;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] == val[key]) {
                return i;
            }
        }
        return idx;
    },
    findItemInArr(arr, key, val) {
        let idx = this.findIdxInArr(arr, key, val);
        return idx >= 0 ? arr[idx] : null;
    },
    checkPhone(phone) {
        let reg = /\d{11}/g
        return reg.test(phone);
    },


    // a and b are javascript Date objects
    dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    },

    formatDate(date = new Date(), pattern = 'YYYY-MM-DD') {
        return format(date, pattern);
    },
    formatTime(date = new Date()) {
        return this.formatDate(date, 'YYYY-MM-DD HH:mm:ss');
    },
    getHeadTail(str) {
        let rs = "-";
        if (str) {
            let arr = str.split(',');
            if (arr.length > 0) {
                rs = arr[0]
                if (arr.length > 1) {
                    rs += " - " + arr[arr.length - 1];
                }
            }
        }

        return rs;
    },
	formatHoursMinutes(date = new Date()){
		let Minutes=new Date(date).getMinutes();
		Minutes=Minutes.toString().length<2?'0'+Minutes:Minutes
		return new Date(date).getHours()+":"+Minutes
	},
    numberWithCommas(x) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-';
    },
    getSaleStatus(status) {
        return status === 0 ? '未销售' : status === 1 ? '在售' : '停售'
    },
    phoneFormat(phone) {
        const arr = phone.toString().split('')
        arr.splice(3, 0, ' ')
        arr.splice(8, 0, ' ')
        return arr.join('')
    },    
    priceFormat(price) {
      if (price) {
        price = price.toString()
        let isPositive = true
        let hasSuf = false
        let sufPrice = ''
        if (price.indexOf('-') > -1) isPositive = false
        if (!isPositive) price = price.slice(1)
        if (price.indexOf('.') > -1) {
          hasSuf = true
          const num = price.indexOf('.')
          sufPrice = price.slice(num, num + 3)
          price = price.slice(0, num)
        }
        const arr = price
          .toString()
          .split('')
          .reverse();
        let count = 0;
        if (arr.length % 3 === 0) {
          count = parseInt(arr.length / 3) - 1;
        } else {
          count = parseInt(arr.length / 3);
        }
        let i = 0;
        const num = 3;
        for (i; i < count; i++) {
          arr.splice(num * (i + 1) + i, 0, ',');
        }
        let str = arr.reverse().join('')
        if (!isPositive) str = '-' + str
        if (hasSuf) str += sufPrice
        return str;
      } else {
        if (price === 0) {
          return price
        } else {
          return '--'
        }
      }
    }
}