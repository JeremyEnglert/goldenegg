<?php

/*********************
SEO META DATA
Custom meta data box

EXAMPLE TO USE IN HEADER:

<title><?php wp_title(''); ?></title>
<meta property="og:title" content="<?php wp_title(''); ?>"/>
<?php echo egg_seo_description(); ?>

*********************/

// Replace wp_title in header
function egg_wp_title( $title ) {
	if ( is_feed() ) return $title;

	global $post;
	$title = '';
	
	if ( is_home() ) {
        $meta_title = get_post_meta(get_option('page_for_posts'), 'seo_textfield', true);
        if ( !empty( $meta_title ) ) {
			$title .= $meta_title;
		} else {
			$title .= 'Blog - ' . get_bloginfo('name');
		}
		
	} elseif ( is_archive() ) {
        $title .= single_cat_title() . ' - ' . get_bloginfo('name');
	
	} else {
		$meta_title = get_post_meta( $post->ID, 'seo_textfield', true );
		if ( !empty( $meta_title ) ) {
			$title .= $meta_title;
		} else {
			$title .= the_title() . ' - ' . get_bloginfo('name');
		}
	}

	return $title;
}
add_filter( 'wp_title', 'egg_wp_title', 10, 2 );


// Function to show seo description
function egg_seo_description() {

	global $post;
	$description = '';
	
	if ( is_home() ) {
        $meta_description = get_post_meta(get_option('page_for_posts'), 'seo_textarea', true);
        if ( !empty( $meta_description ) ) {
			$description .= $meta_description;
			return '<meta property="og:description" name="description" content="' . $description . '">';
		} else {
			return false;
		}
	
	} else {
		$meta_description = get_post_meta( $post->ID, 'seo_textarea', true );
		if ( !empty( $meta_description ) ) {
			$description .= $meta_description;
			return '<meta property="og:description" name="description" content="' . $description . '">';
		} else {
			return false;
		}
	}
}



// Little function to return a custom field value
function seo_get_custom_field( $value ) {
	global $post;

    $custom_field = get_post_meta( $post->ID, $value, true );
    if ( !empty( $custom_field ) )
	    return is_array( $custom_field ) ? stripslashes_deep( $custom_field ) : stripslashes( wp_kses_decode_entities( $custom_field ) );

    return false;
}


// Register the Metabox
function seo_add_custom_meta_box() {
	add_meta_box( 'seo-meta-box', __( 'SEO Meta Data', 'cslice' ), 'seo_meta_box_output', 'post', 'normal', 'high' );
	add_meta_box( 'seo-meta-box', __( 'SEO Meta Data', 'cslice' ), 'seo_meta_box_output', 'page', 'normal', 'high' );
	add_meta_box( 'seo-meta-box', __( 'SEO Meta Data', 'cslice' ), 'seo_meta_box_output', 'programs', 'normal', 'high' );
	add_meta_box( 'seo-meta-box', __( 'SEO Meta Data', 'cslice' ), 'seo_meta_box_output', 'schools', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'seo_add_custom_meta_box' );

// Output the Metabox
function seo_meta_box_output( $post ) {
	// create a nonce field
	wp_nonce_field( 'my_seo_meta_box_nonce', 'seo_meta_box_nonce' ); ?>
	
	<p>
		<label for="seo_textfield"><strong>TITLE</strong> (up to 70 characters long)</label><br />
		<input type="text" name="seo_textfield" id="seo_textfield" value="<?php echo seo_get_custom_field( 'seo_textfield' ); ?>" size="70" />
    </p>
	
	<p>
		<label for="seo_textarea"><strong>DESCRIPTION</strong> (displays in search results)</label><br />
		<textarea name="seo_textarea" id="seo_textarea" cols="70" rows="4"><?php echo seo_get_custom_field( 'seo_textarea' ); ?></textarea>
    </p>
    
	<?php
}

// Save the Metabox values
function seo_meta_box_save( $post_id ) {
	// Stop the script when doing autosave
	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

	// Verify the nonce. If insn't there, stop the script
	if( !isset( $_POST['seo_meta_box_nonce'] ) || !wp_verify_nonce( $_POST['seo_meta_box_nonce'], 'my_seo_meta_box_nonce' ) ) return;

	// Stop the script if the user does not have edit permissions
	if( !current_user_can( 'edit_post' ) ) return;

    // Save the textfield
	if( isset( $_POST['seo_textfield'] ) )
		update_post_meta( $post_id, 'seo_textfield', esc_attr( $_POST['seo_textfield'] ) );

    // Save the textarea
	if( isset( $_POST['seo_textarea'] ) )
		update_post_meta( $post_id, 'seo_textarea', esc_attr( $_POST['seo_textarea'] ) );
}
add_action( 'save_post', 'seo_meta_box_save' );


// Place the metabox in the post edit page below the editor before other metaboxes (like the Excerpt)
// add_meta_box( 'seo-meta-box', __( 'Metabox Example', 'textdomain' ), 'seo_meta_box_output', 'post', 'normal', 'high' );
// Place the metabox in the post edit page below the editor at the end of other metaboxes
// add_meta_box( 'seo-meta-box', __( 'Metabox Example', 'textdomain' ), 'seo_meta_box_output', 'post', 'normal', '' );
// Place the metabox in the post edit page in the right column before other metaboxes (like the Publish)
// add_meta_box( 'seo-meta-box', __( 'Metabox Example', 'textdomain' ), 'seo_meta_box_output', 'post', 'side', 'high' );
// Place the metabox in the post edit page in the right column at the end of other metaboxes
// add_meta_box( 'seo-meta-box', __( 'Metabox Example', 'textdomain' ), 'seo_meta_box_output', 'post', 'side', '' );

?>