pragma circom 2.0.0;

template Example () {
    signal input a;
    signal input b;
    signal output c;
    
    c <== a * b;

    
}

component main { public [ a ] } = Example();

/* INPUT = {
    "a": "5",
    "b": "77"
} */
