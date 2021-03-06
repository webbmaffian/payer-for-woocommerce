jQuery( function( $ ) {
    var wc_payer_checkout = {
        moveInputFields: function() {
            var pno_field           = $('#billing_pno_field'),
                post_code           = $('#billing_postcode_field'),
                customer_details    = $('div.woocommerce-billing-fields div'),
                button              = $('#payer_get_address');

            pno_field.addClass('form-row-first');
            post_code.addClass('form-row-last');
            post_code.removeClass('form-row-wide');
            post_code.before('<div id="payer_postcode_placeholder"></div>');
            customer_details.prepend(post_code);     
            customer_details.prepend(pno_field);
            post_code.after(button);      
        },

        hidePNOfield: function() {
            var pno_field   = $('#billing_pno_field');
            $(pno_field).hide();
        },

        hideAddressButton: function() {
            var button      = $('#payer_get_address');
            $(button).hide();
        },

        showPNOfield: function() {
            var pno_field   = $('#billing_pno_field');
            $(pno_field).show();
        },

        showAddressButton: function() {
            var button      = $('#payer_get_address');
            $(button).show();
        },

        resetPostCodeField: function() {
            var placeholder_div = $('#payer_postcode_placeholder'),
                post_code       = $('#billing_postcode_field');
                
            placeholder_div.before( post_code );
            placeholder_div.remove();
            post_code.removeClass('form-row-last');
            post_code.addClass('form-row-wide');

        },

        addGetAddressButton: function() {
            var post_code   = $('#billing_postcode_field'),
                button      = '<button type="button" class="payer_get_address_button button" id="payer_get_address">Get Address</button>';

            post_code.after(button);
        },

        getAddress: function() {
            var personal_number = $('#billing_pno').val(),
                zip_code = $('#billing_postcode').val();
            // Set AJAX data
            var data = {
                'action': 'get_address',
                'personal_number': personal_number,
                'zip_code' : zip_code,
            }
            // Make AJAX call
            jQuery.post(payer_checkout_params.get_address, data, function (data) {
                if (true === data.success) {
                    var address_data = data.data;
                    wc_payer_checkout.populateAddressFields( address_data );
                }
            });
        },
        populateAddressFields: function( address_data ) {
            // Set fields
            var first_name      = $('#billing_first_name'),
                last_name       = $('#billing_last_name'),
                organisation    = $('#billing_company'),
                city            = $('#billing_city'),
                post_code       = $('#billing_postcode'),
                address_1       = $('#billing_address_1'),
                address_2       = $('#billing_address_2');

            // Populate fields
            first_name.val( wc_payer_checkout.maskFormField( address_data.first_name ) );
            last_name.val( wc_payer_checkout.maskFormField( address_data.last_name ) );
            organisation.val( wc_payer_checkout.maskFormField( address_data.organisation ) );
            city.val( wc_payer_checkout.maskFormField( address_data.city ) );
            post_code.val( address_data.zip_code );
            address_1.val( wc_payer_checkout.maskFormField( address_data.address_1 ) );
            address_2.val( wc_payer_checkout.maskFormField( address_data.address_2 ) );
        },
        maskFormField: function( field ) {
            if ( field !== '' ) {
                var field_split = field.split( ' ' );
                var field_masked = new Array();
    
                $.each(field_split, function ( i, val ) {
                    if ( isNaN( val ) ) {
                        field_masked.push( val.charAt( 0 ) + Array( val.length ).join( '*' ) );
                    } else {
                        field_masked.push( '**' + val.substr( val.length - 3 ) );
                    }
                });
    
                return field_masked.join( ' ' );
            }
        },

        addBodyClass: function() {
            $('body').addClass('payer-active');
        },

        removeBodyClass: function() {
            $('body').removeClass('payer-active');
        }
    }
    $(document).on('ready', function() {
        wc_payer_checkout.addGetAddressButton();
    });

    $('body').on('click', '#payer_get_address', function() {
            wc_payer_checkout.getAddress();
    });

    $(document).on('updated_checkout', function () {        
        if ( payer_checkout_params.locale === 'SE' ) {
            var selected_gateway = $("input[name='payment_method']:checked").val();
            if ( selected_gateway.indexOf("payer_") >= 0 ) {
                if( false === $('body').hasClass('payer-active') ) {
                    wc_payer_checkout.moveInputFields();  
                    wc_payer_checkout.showPNOfield();
                    wc_payer_checkout.showAddressButton();
                    wc_payer_checkout.addBodyClass();
                }
            } else {
                wc_payer_checkout.hidePNOfield();
                wc_payer_checkout.hideAddressButton();
                wc_payer_checkout.resetPostCodeField();          
                wc_payer_checkout.removeBodyClass();                              
            }
        }
    });
    var selected_gateway = $('form[name="checkout"] input[name="payment_method"]:checked').val();
    $(document).on("change", "input[name='payment_method']", function (event) {
        if (selected_gateway !== $('form[name="checkout"] input[name="payment_method"]:checked').val()) {
            jQuery(document.body).trigger("update_checkout");
        }
    });
});