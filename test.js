class test {
	get fun() {
		return this.e;
	}

	constructor(e) {
		this.e = e || 3;

		this.fune(e);
	}
	fune(r) {
		return 34;
	}
}

console.log(new test(4).fun);
console.log(new test(4));
