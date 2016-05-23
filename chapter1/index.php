<?php

$a = array("hello", 'world');
$b = $a;

$b[0] = 'bye';

var_dump($a);
var_dump($b);
