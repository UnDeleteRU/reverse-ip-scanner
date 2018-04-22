const dns = require('dns');

class Seeker  {
    lookup(ip) {
        return new Promise((resolve, reject) => {
            dns.reverse(ip, (err, hostname) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hostname);
                }
            })
        });
    }

    async runner(list) {
        for (let i = 0; i < list.length; i++) {
            try {
                let ip = list[i];
                let name = await this.lookup(ip);
                console.log(ip, name.join(' '));
            } catch (e) {
            }
        }
    }

    seek(network) {
        let reg = /(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)/i;

        if (reg.test(network)) {
            let parts = reg.exec(network);
            let list = [];
            let count = Math.pow(2, 32 - parts[5]);

            for (let i = 0; i < count; i++) {
                let add4 = i % 256;
                let add3 = parseInt(((i - add4) % 65536) / 256);
                let add2 = parseInt(((i - add3 - add4) % 16777216) / 65536);

                let ip = parts[1] + '.' + (parseInt(parts[2]) + add2) + '.' + (parseInt(parts[3]) + add3)
                    + '.' + (parseInt(parts[4]) + add4);
                list.push(ip);
            }

            this.runner(list);
        }
    }
}

const seeker = new Seeker();
let network = process.argv[2]

if (typeof network !== undefined) {
    seeker.seek(network);
}
