var a= ["hello","world"];
var b= a;

console.log(a);
b[0] = "bye";
a[0];
b[0];
console.log(a);
console.log(b);
var a =function(){};
console.log(a);



function ab() {
    try{
        throw new Error("hi");
    }catch(e)
    {
        console.log(1);
    }
};
ab();

var a = { a :"b", c:"d"};

for(var i in a){
    console.log(i);
}
Object.prototype.c ='d';

for( var i in a)
{
    if(a.hasOwnProperty(i))
    {
        console.log(i);
    }
}

console.log(Array.isArray(new Array));
[1,2,3].forEach(function(v){
    console.log(v);
});
