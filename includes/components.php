<?php

/**
 * Use to get a basic or dumb component
 *
 * Dumb components take simple variable input and output HTML with that input.
 * Dumb components do not connect to the database or require state.
 * Dumb components usually output HTML to the page.
 *
 * @author	Jake Snyder
 * @param	string	$component	The name of the eventual field in ACF
 * @param	array	$settings	An array of parameters to determine the output of the component
 * @return	bool	If the component is found, it returns true, otherwise false
 */
function egg_component( $component, $settings = [], $container = false ) {
	// If a container exists, use it. Unless component is forced in the settings.
	if ( empty($settings['component']) && $container = patch_container( $component, $settings ) ) {
		return $container;
	}

	$settings['component'] = false;

	// Always send classes through, so it is expected
	// Also allow an array of classes that we combine into a string here
	$class = $component;
	if ( isset($settings['classes']) ) { $settings['class'] = $settings['classes']; }
	if ( ! empty($settings['class']) && is_array($settings['class']) ) {
		$settings['class'] = implode(' ', $settings['class']);
	}
	if ( ! empty($settings['class']) ) {
		$class .= ' ' . $settings['class'];
	}
	if ( ! empty($settings['build_count']) ) {
		$class .= ' ' . "section--{$settings['build_count']}";
	}
	$class = esc_attr( $class );
	$class = " class=\"$class\"";

	// Allow an id attribute to be set
	$id = '';
	if ( ! empty($settings['id']) ) {
		$id = esc_attr( $settings['id'] );
		$id = " id=\"$id\"";
	} elseif ( ! empty($settings['build_count']) ) {
		$id = esc_attr( "section-{$settings['build_count']}" );
		$id = " id=\"$id\"";
	}

	// An interface for adding other attributes to the parent
	// Sets up All attributes to be ready for the component in one variable
	$attr = '';
	if ( ! empty($settings['attr']) && is_array($settings['attr']) ) {
		foreach ( $settings['attr'] as $key => $value ) {
			$attr .= " $key=\"" . esc_attr( $value ) . '"';
		}
	}
	$attr = $id . $class . $attr;

	if ( is_file( get_stylesheet_directory() . "/components/$component/$component.php" ) ) {
		include get_stylesheet_directory() . "/components/$component/$component.php";
		return true;
	}
	return false;
}
