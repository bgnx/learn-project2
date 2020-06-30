let observable = (value) => {
  return mobx.observable.box(value, { deep: false });
}

let firstName = observable(`ff nn`);
let lastName = observable(`ll nn`);

mobx.reaction(()=>{
  return firstName.get() + ` ` + lastName.get();
}, ()=> console.log(`was changed`));

firstName.set(`ff nnn`);
lastName.set(`ll nnn`);