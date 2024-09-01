const a = new countUp.CountUp("test", 5000, { enableScrollSpy: true });
const b = new countUp.CountUp("f_staff", 2000, { enableScrollSpy: true });
const c = new countUp.CountUp("m_staff", 3000, { enableScrollSpy: true });
a.start();
b.start();
c.start();

console.log("test");
