//y = a(x – h)^2 + k Opens Up (+a) or Down (-a) Opens Up (+a) or Down (-a)

import { Decimal} from "decimal.js";


const parIntY = ( a, h, k,) => {
	let vertex = [h, k],
		axisOfSym = h,
		x = Math.sqrt((k * -1) / a)
	let y = ((0-h)**2)+k

	return {
		xIntSquared: new Decimal(x**2).toFraction(4).toString().replace(/,/, "/"),
		yInt: y,
		vertex: vertex,
		axisOfSym: axisOfSym
	};
};


//x = a(y – k)^2 + h Opens Right (+a) or Left (-a)
const parIntX = ( a,  h, k) => {
	let vertex = [h, k],
		axisOfSym = k,
		y = (0 - h) ** 2 + k;
	return {
		yIntSquared: new Decimal( y** 2).toFraction(3).toString().replace(/,/, "/"),
		xInt: Math.sqrt((k * -1) / a),
		vertex: vertex,
		axisOfSym: axisOfSym,
	};;
};

console.log(parIntY(3, 2, -5));

