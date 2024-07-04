<?php
global $post;

if ($post->ID == 1379 || $post->ID == 2404) {
    wp_enqueue_style('default-style', '/trim-calculator-template/css/style.css');
    wp_enqueue_script('trim-calc-jq', '/trim-calculator-template/js/jquery/jquery.js');
    wp_enqueue_script('trim-calc-tippy', '/trim-calculator-template/js/tippy/1.js');
    wp_enqueue_script('trim-calc-tippy2', '/trim-calculator-template/js/tippy/2.js');
    wp_enqueue_script('trim-calc-scroll', '/trim-calculator-template/js/perfect-scrollbar.js');
    if ($post->ID == 1379) {
        wp_enqueue_script('trim-calc-lang', '/trim-calculator-template/js/lang-en.js');
    } else if ($post->ID == 2404) {
        wp_enqueue_script('trim-calc-lang', '/trim-calculator-template/js/lang-de.js');
    }
    wp_enqueue_script('trim-calc-main', '/trim-calculator-template/js/calculator.js');
}
