<?php 
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Payer_Masterpass_Populate_Order {
    public static function add_item_to_cart( $product_id, $quantity, $variation_id ) {
        error_log( 'cart should be updated' );
        WC()->cart->add_to_cart( $product_id, $quantity, $variation_id );
    }

    public static function set_gateway( $order ) {
        $available_gateways = WC()->payment_gateways->payment_gateways();
        $payment_method = $available_gateways['payer_masterpass'];
        $order->set_payment_method( $payment_method );
        $order->save();
    }

    public static function add_order_details( $order ) {
        $order->set_shipping_total( WC()->cart->get_shipping_total() );
        $order->set_discount_total( WC()->cart->get_discount_total() );
        $order->set_discount_tax( WC()->cart->get_discount_tax() );
        $order->set_cart_tax( WC()->cart->get_cart_contents_tax() + WC()->cart->get_fee_tax() );
        $order->set_shipping_tax( WC()->cart->get_shipping_tax() );
        $order->set_total( WC()->cart->get_total( 'edit' ) );

        WC()->checkout()->create_order_line_items( $order, WC()->cart );
        WC()->checkout()->create_order_fee_lines( $order, WC()->cart );
        WC()->checkout()->create_order_shipping_lines( $order, WC()->session->get( 'chosen_shipping_methods' ), WC()->shipping->get_packages() );
        WC()->checkout()->create_order_tax_lines( $order, WC()->cart );
        WC()->checkout()->create_order_coupon_lines( $order, WC()->cart );
        $order->calculate_totals();
        $order->save();
    }
}