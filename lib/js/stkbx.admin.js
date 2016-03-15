
//*****************************************************************************************************
// handle sticky sidebar calculations
//*****************************************************************************************************
function SES_IsScrolledTo( elem ) {

    var doc_top     = jQuery( window ).scrollTop(); //num of pixels hidden above current screen
    var doc_bottom  = doc_top + jQuery( window ).height();
    var elem_top    = jQuery( elem ).offset().top; //num of pixels above the elem
    var elem_bottom = elem_top + jQuery( elem ).height();

    // account for Admin Bar if present
    if ( jQuery('#wpadminbar').length){
        elem_top -= jQuery('#wpadminbar').outerHeight() + parseInt( stickyVars.y_offset, 10 );
    }

    return ( ( elem_top <= doc_top ) );
}

//*****************************************************************************************************
// the core sticky side function
//*****************************************************************************************************
function SES_SideStickyLoader( SES_ScreenSize, stickyID ) {

    // bail on pages without body class
    if ( ! jQuery( 'body' ).hasClass( 'sticky-publish-box' ) ) {
        return;
    }

    // bail if we dont have our wpcontent div ID
    if ( ! jQuery( '#side-sortables' ).length ) {
        return;
    }

    // check the width of our container (since we dont side by side on mobile)
    // and load if we are above the breakpoint
    if ( SES_ScreenSize > stickyVars.breakpoint ) {
        SES_SideSticky( '#side-sortables', stickyID );
    }

	// bail if the box is closed
	if ( jQuery( stickyID ).hasClass( 'closed' ) ) {

		// clear out any stuff
		SES_SideStickyRemoval( '#side-sortables', stickyID );

		// and bail
		return;
	}

    // now do our check again on resize
    jQuery( window ).resize( function() {

        // get our new width
        SES_ScreenSize   = jQuery( window ).width();

        // apply if on tablet or above
        if ( SES_ScreenSize > stickyVars.breakpoint ) {
            SES_SideSticky( '#side-sortables', stickyID );
        } else {
            SES_SideStickyRemoval( '#side-sortables', stickyID );
        }
    });

}

//*****************************************************************************************************
// make the sticky editor sidebar
//*****************************************************************************************************
function SES_SideSticky( stickyWrap, stickyID ) {

    // get our offset
    var offTop          = jQuery( stickyWrap ).offset().top - 50,
        stickyAttach	= jQuery( stickyID );

    // check the position on load
    SES_SideStickyMaybeInit( stickyWrap, stickyAttach, stickyID, offTop );

    // start checking on scroll
    jQuery( window ).scroll( function() {

        // if we hit our mark
        SES_SideStickyMaybeInit( stickyWrap, stickyAttach, stickyID, offTop );

        // if we get back to the top, remove our stuff
        if ( ( offTop + parseInt( stickyVars.y_offset, 10 ) ) > stickyAttach.offset().top ) {
        	SES_SideStickyRemoval( stickyWrap, stickyAttach );
        }
    });
}

function SES_SideStickyMaybeInit( stickyWrap, stickyAttach, stickyID, offTop ) {
    if( SES_IsScrolledTo( stickyAttach ) && ! jQuery( stickyID ).hasClass( 'closed' ) ) {

        // get our sizes and offsets
        var pubWth  = jQuery( stickyID ).width();
        var offRgt  = ( jQuery( window ).width() - ( jQuery( stickyID ).offset().left + jQuery( stickyID ).outerWidth() ) );

        // add the actual sticky CSS
        stickyAttach.css({
            'width' : pubWth + 'px',
            'position' : 'fixed',
            'top' : offTop + 'px',
            'right' : offRgt + 'px',
            'z-index' : '9999',
        });

        // implement a faux clone so that sidebar items don't jump when we go sticky
        jQuery('.postbox-container').css( 'paddingTop', ( parseInt( stickyVars.y_offset, 10 ) + jQuery( stickyVars.stickyid ).outerHeight() ) + 'px' );

        // set the opacity of all the other items
        jQuery( stickyWrap ).find( '.postbox' ).not( stickyAttach ).css( 'opacity', stickyVars.opacity );
    }
}

//*****************************************************************************************************
// the removal function for the stickybox
//*****************************************************************************************************
function SES_SideStickyRemoval( stickyWrap, stickyID ) {

	// remove the sticky CSS
	jQuery( stickyID ).removeAttr( 'style' );

    // remove the opacity of all the other items
    jQuery( stickyWrap ).find( '.postbox' ).not( '.sticky-side-wrapper' ).css( 'opacity', '' );

    // remove our faux clone padding
    jQuery('.postbox-container').css('paddingTop','');
}

//*****************************************************************************************************
// start the engine
//*****************************************************************************************************
jQuery(document).ready( function($) {

//*****************************************************************************************************
// check our screen size on itital load
//*****************************************************************************************************
    var SES_ScreenSize = $( window ).width();

//*****************************************************************************************************
// make the preset box sticky for items we set with the class
//*****************************************************************************************************
    $( window ).load( function() {
    	if ( ! $( stickyVars.stickyid ).hasClass( 'closed' ) ) {
    		SES_SideStickyLoader( SES_ScreenSize, stickyVars.stickyid );
    	}
    });

//*****************************************************************************************************
// check for open / close of metabox and reload sticky
//*****************************************************************************************************
	$( stickyVars.stickyid ).on( 'click', '.handlediv', function() {
    	if ( ! $( stickyVars.stickyid ).hasClass( 'closed' ) ) {
    		SES_SideStickyLoader( SES_ScreenSize, stickyVars.stickyid );
    	} else {
    		SES_SideStickyRemoval( '#side-sortables', stickyVars.stickyid );
    	}
	});

//*****************************************************************************************************
// we are done here. go home
//*****************************************************************************************************
});
