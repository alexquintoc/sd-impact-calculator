<?php
/**
 * Theme functions and definitions.
 *
 * For additional information on potential customization options,
 * read the developers' documentation:
 *
 * https://developers.elementor.com/docs/hello-elementor-theme/
 *
 * @package HelloElementorChild
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_CHILD_VERSION', '2.0.0' );

/**
 * Load child theme scripts & styles.
 *
 * @return void
 */
function hello_elementor_child_scripts_styles() {

	wp_enqueue_style(
		'hello-elementor-child-style',
		get_stylesheet_directory_uri() . '/style.css',
		[
			'hello-elementor-theme-style',
		],
		HELLO_ELEMENTOR_CHILD_VERSION
	);

}
add_action( 'wp_enqueue_scripts', 'hello_elementor_child_scripts_styles', 20 );

function get_default_featured_image() {
    // Replace with your default image URL or attachment ID
    return 'http://wip.socaltecc.org/wp-content/uploads/2025/05/background.jpg';
}

function filter_featured_image($html, $post_id, $post_thumbnail_id, $size, $attr) {
    if (empty($html)) {
        $default_image_url = get_default_featured_image();
        if ($default_image_url) {
            return '<img src="' . esc_url($default_image_url) . '" class="wp-post-image" />';
        }
    }
    return $html;
}
add_filter('post_thumbnail_html', 'filter_featured_image', 20, 5);

function register_grant_opportunity_cpt() {
    $labels = array(
        'name'               => 'Funding Opportunities',
        'singular_name'      => 'Funding Opportunity',
        'menu_name'          => 'Funding Opportunities',
        'name_admin_bar'     => 'Funding Opportunity',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Funding Opportunity',
        'new_item'           => 'New Funding Opportunity',
        'edit_item'          => 'Edit Funding Opportunity',
        'view_item'          => 'View Funding Opportunity',
        'all_items'          => 'All Funding Opportunities',
        'search_items'       => 'Search Funding Opportunities',
        'not_found'          => 'No opportunities found',
        'not_found_in_trash' => 'No opportunities found in Trash'
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'show_in_menu'       => true,
        'menu_position'      => 20,
        'menu_icon'          => 'dashicons-portfolio', // Change icon as needed
        'supports'           => array('title', 'editor', 'thumbnail'),
        'has_archive'        => true,
        'rewrite'            => array('slug' => 'funding-opportunities'),
        'show_in_rest'       => true, // Enables Gutenberg + REST API support
    );

    register_post_type('funding_opportunity', $args);
}
add_action('init', 'register_grant_opportunity_cpt');

function register_award_range_taxonomy() {
    register_taxonomy(
        'award_range',
        'funding_opportunity',
        array(
            'label' => 'Award Ranges',
            'rewrite' => array('slug' => 'award-range'),
            'hierarchical' => false, // Use true if used like categories
            'show_admin_column' => true,
			'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'register_award_range_taxonomy');


add_filter('get_terms_args', 'custom_order_award_range_terms', 10, 2);
function custom_order_award_range_terms($args, $taxonomies) {
    if (in_array('award_range', (array) $taxonomies)) {
        $args['orderby'] = 'slug'; // or 'slug', 'term_id', etc.
        $args['order'] = 'ASC'; // or 'DESC'
    }
    return $args;
}


function restrict_grant_opportunities_archive() {
    if (is_post_type_archive('funding-opportunity') && !is_user_logged_in()) {
        wp_redirect(home_url('log-in'));
        exit;
    }
}
add_action('template_redirect', 'restrict_grant_opportunities_archive');

function hide_admin_bar_for_members() {
    if (current_user_can('member')) {
        show_admin_bar(false);
    }
}
add_action('after_setup_theme', 'hide_admin_bar_for_members');

function format_acf_number($atts) {
    $field = $atts['field'] ?? '';
    $post_id = get_the_ID();
    $value = get_field($field, $post_id);
    if (is_numeric($value)) {
        return '$' . number_format($value, 0, '.', ',');
    }
    return $value;
}
add_shortcode('acf_format_number', 'format_acf_number');


/**
 * Helper: get comma-separated term names from an ACF taxonomy field
 * Works whether ACF returns Term Object(s) or ID(s), single or multiple,
 * and whether "Save Terms" is ON or OFF.
 */
function aq_term_names_from_acf_tax( int $post_id, string $acf_field_name, string $taxonomy_slug ): string {
    // Prefer native WP terms if synced
    $terms = get_the_terms( $post_id, $taxonomy_slug );
    if ( $terms && ! is_wp_error( $terms ) ) {
        return implode( ', ', wp_list_pluck( $terms, 'name' ) );
    }

    // Fall back to the ACF field value
    $acf_val = get_field( $acf_field_name, $post_id );
    if ( ! $acf_val ) return '';

    if ( is_array( $acf_val ) ) {
        if ( $acf_val && $acf_val[0] instanceof WP_Term ) {
            return implode( ', ', array_map( fn($t) => $t->name, $acf_val ) );
        }
        // assume array of IDs
        $term_objs = get_terms([
            'taxonomy'   => $taxonomy_slug,
            'include'    => array_map('intval', $acf_val),
            'hide_empty' => false,
        ]);
        return ( $term_objs && ! is_wp_error( $term_objs ) )
            ? implode( ', ', wp_list_pluck( $term_objs, 'name' ) )
            : '';
    }

    if ( $acf_val instanceof WP_Term ) {
        return $acf_val->name;
    }

    $t = get_term( (int) $acf_val, $taxonomy_slug );
    return ( $t && ! is_wp_error( $t ) ) ? $t->name : '';
}

/**
 * Render the search form (shared by normal + empty states)
 */
function aq_render_grants_search_form( string $page_base, string $anchor, string $q ): void {
    echo '<span id="grants-results"></span>';
    ?>
    <form method="get" class="grant-search"
          action="<?php echo esc_url( $page_base . '#'.$anchor ); ?>"
          style="margin:0 0 12px; display:flex; gap:8px; align-items:center;">
        <input type="text" name="q" value="<?php echo esc_attr($q); ?>"
               placeholder="Search by opportunity, funder, or deadline…"
               style="width:320px; max-width:100%; padding:8px;">
        <button type="submit" style="padding:8px 12px;">Search</button>
        <?php if ($q !== ''): ?>
            <button type="button"
                    onclick="window.location.href='<?php echo esc_js( $page_base . '#'.$anchor ); ?>'"
                    style="padding:8px 12px; border:1px solid #ccc; background:#fff; cursor:pointer;">
              Clear
            </button>
        <?php endif; ?>
    </form>
    <?php
}


/**
 * Shortcode: [grant_opportunity_table posts_per_page="25" anchor="edit"]
 * - Search title/content OR ACF meta (funder, deadline)
 * - Sortable columns: Opportunity, Funder, Opportunity Status (taxonomy),
 *   Deadline (ACF Ymd), Last Modified, Post Status
 * - Pagination keeps q/sort/dir and the #anchor
 */
function display_grant_opportunities_table( $atts = [] ) {
    $atts = shortcode_atts([
        'posts_per_page' => 25,
        'anchor'         => 'edit',
    ], $atts, 'grant_opportunity_table');

    $q     = isset($_GET['q']) ? sanitize_text_field(wp_unslash($_GET['q'])) : '';
    $paged = isset($_GET['pg']) ? max(1, (int) $_GET['pg']) : 1;

    // sorting params
    $sort = isset($_GET['sort']) ? sanitize_key($_GET['sort']) : '';
    $dir  = isset($_GET['dir'])  ? strtolower($_GET['dir'])    : 'asc';
    $dir  = in_array($dir, ['asc','desc'], true) ? $dir : 'asc';
    $sortable = ['title','funder','deadline','status_tax','post_status','modified'];
    if ( ! in_array($sort, $sortable, true) ) $sort = '';

    // taxonomy slug for your ACF taxonomy field "status" (adjust if different)
    $taxonomy_slug = 'opportunity-status';

    // include drafts for editors; otherwise only published
    $allowed_statuses = current_user_can('edit_posts')
        ? ['publish','draft','pending','future','private']
        : ['publish'];

    // base URL for this page (drop q/pg when building links)
    $current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $page_base   = remove_query_arg( ['q','pg'], $current_url );

    // small helpers (closures)
    $build_url = function(array $extra = []) use ($page_base, $atts) {
        $keep = $_GET;
        unset($keep['pg']); // reset pagination when changing sort/dir
        $args = array_merge($keep, $extra);
        return add_query_arg($args, $page_base) . '#'.$atts['anchor'];
    };

	$print_header = function($label, $key, $style) use ($sort, $dir, $build_url) {
		$next_dir = ($sort === $key && $dir === 'asc') ? 'desc' : 'asc';
		$url      = $build_url(['sort' => $key, 'dir' => $next_dir]);
		$arrow    = ($sort === $key) ? ($dir === 'asc' ? ' ▲' : ' ▼') : '';

		// allow only a few safe tags in the label (br, small, span)
		$label_html = wp_kses($label, [
			'br'    => [],
			'small' => [],
			'span'  => ['class' => []],
		]);

		echo '<th style="'.$style.'"><a href="'.esc_url($url).'" data-hard-nav="1" style="text-decoration:none;">'
		   . $label_html . esc_html($arrow) . '</a></th>';
	};


    // -----------------------
    // Search: OR across title/content and ACF meta
    // -----------------------
    $post__in = [];
    if ( $q !== '' ) {
        $ids_title = get_posts([
            'post_type'      => 'funding_opportunity',
            'post_status'    => $allowed_statuses,
            's'              => $q,
            'fields'         => 'ids',
            'no_found_rows'  => true,
            'posts_per_page' => -1,
        ]);
        $ids_meta = get_posts([
            'post_type'      => 'funding_opportunity',
            'post_status'    => $allowed_statuses,
            'fields'         => 'ids',
            'no_found_rows'  => true,
            'posts_per_page' => -1,
            'meta_query'     => [
                'relation' => 'OR',
                ['key' => 'funder',   'value' => $q, 'compare' => 'LIKE'],
                ['key' => 'deadline', 'value' => $q, 'compare' => 'LIKE'],
            ],
        ]);
        $post__in = array_values( array_unique( array_merge($ids_title, $ids_meta) ) );

        if ( empty($post__in) ) {
            ob_start();
            // Search form (empty state)
            echo '<span id="grants-results"></span>'; ?>
            <form method="get" class="grant-search"
                  action="<?php echo esc_url( $page_base . '#'.$atts['anchor'] ); ?>"
                  style="margin:0 0 12px; display:flex; gap:8px; align-items:center;">
                <input type="text" name="q" value="<?php echo esc_attr($q); ?>"
                       placeholder="Search by opportunity, funder, or deadline…"
                       style="width:320px; max-width:100%; padding:8px;">
                <button type="submit" style="padding:8px 12px;">Search</button>
                <button type="button"
                        onclick="window.location.href='<?php echo esc_js( $page_base . '#'.$atts['anchor'] ); ?>'"
                        style="padding:8px 12px; border:1px solid #ccc; background:#fff; cursor:pointer;">
                  Clear
                </button>
            </form>
            <p>No funding opportunities found.</p>
            <?php
            return ob_get_clean();
        }
    }

    // -----------------------
    // Main query + sorting
    // -----------------------
    $args = [
        'post_type'      => 'funding_opportunity',
        'post_status'    => $allowed_statuses,
        'posts_per_page' => (int) $atts['posts_per_page'],
        'paged'          => $paged,
    ];
    if ( $q !== '' ) {
        $args['post__in'] = $post__in;
    }

    // apply orderby for supported sorts
    $orderby_filter = null;
    if ( $sort === 'title' ) {
        $args['orderby'] = 'title';
        $args['order']   = $dir;
    } elseif ( $sort === 'funder' ) {
        $args['meta_key'] = 'funder';
        $args['orderby']  = 'meta_value';
        $args['order']    = $dir;
    } elseif ( $sort === 'deadline' ) {
        $args['meta_key'] = 'priority_date';
        $args['orderby']  = 'meta_value_num'; // Ymd as numeric
        $args['order']    = $dir;
    } elseif ( $sort === 'modified' ) {
        $args['orderby'] = 'modified';
        $args['order']   = $dir;
    } elseif ( $sort === 'status_tax' || $sort === 'post_status' ) {
        add_filter('posts_clauses', $orderby_filter = function($clauses) use ($sort, $dir, $taxonomy_slug) {
            global $wpdb;
            $direction = ($dir === 'desc') ? 'DESC' : 'ASC';
            if ( $sort === 'status_tax' ) {
                $clauses['join']  .= " LEFT JOIN {$wpdb->term_relationships} tr ON ({$wpdb->posts}.ID = tr.object_id) ";
                $clauses['join']  .= " LEFT JOIN {$wpdb->term_taxonomy}    tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = '{$taxonomy_slug}') ";
                $clauses['join']  .= " LEFT JOIN {$wpdb->terms}            t  ON (tt.term_id = t.term_id) ";
                $clauses['groupby'] = "{$wpdb->posts}.ID";
                $clauses['orderby'] = " t.name IS NULL, t.name {$direction}";
            } else { // post_status
                $clauses['orderby'] = " {$wpdb->posts}.post_status {$direction}, {$wpdb->posts}.post_date DESC";
            }
            return $clauses;
        }, 10, 1);
    } else {
        // default: newest first
        $args['orderby'] = 'date';
        $args['order']   = 'DESC';
    }

    $query = new WP_Query($args);
    if ( $orderby_filter ) {
        remove_filter('posts_clauses', $orderby_filter, 10);
    }

    ob_start();

    // Search form (normal flow)
    echo '<span id="grants-results"></span>'; ?>
    <form method="get" class="grant-search"
          action="<?php echo esc_url( $page_base . '#'.$atts['anchor'] ); ?>"
          style="margin:0 0 12px; display:flex; gap:8px; align-items:center;">
        <input type="text" name="q" value="<?php echo esc_attr($q); ?>"
               placeholder="Search by opportunity, funder, or deadline…"
               style="width:320px; max-width:100%; padding:8px;">
        <button type="submit" style="padding:8px 12px;">Search</button>
        <?php if ($q !== ''): ?>
            <button type="button"
                    onclick="window.location.href='<?php echo esc_js( $page_base . '#'.$atts['anchor'] ); ?>'"
                    style="padding:8px 12px; border:1px solid #ccc; background:#fff; cursor:pointer;">
              Clear
            </button>
        <?php endif; ?>
    </form>
    <?php

    if ( ! $query->have_posts() ) {
        echo '<p>No funding opportunities found.</p>';
        wp_reset_postdata();
        return ob_get_clean();
    }

    // ---------- TABLE ----------
    echo '<table style="width:100%; border-collapse:collapse;">';
    echo '<thead><tr>';
    $print_header('Opportunity<br><small>View</small>', 'title',
              'border-bottom:1px solid #ccc; padding:8px; text-align:left; width:28%;');
    $print_header('Funder',             'funder',     'border-bottom:1px solid #ccc; padding:8px; text-align:left; width:22%;');
    $print_header('Opportunity Status', 'status_tax', 'border-bottom:1px solid #ccc; padding:8px; text-align:left; width:12%;');
    $print_header('Priority Date',           'deadline',   'border-bottom:1px solid #ccc; padding:8px; text-align:left; width:14%; white-space:nowrap;');
    $print_header('Last Reviewed',      'modified',   'border-bottom:1px solid #ccc; padding:8px; text-align:left; width:14%; white-space:nowrap;');
    $print_header('Post Status',        'post_status','border-bottom:1px solid #ccc; padding:8px; text-align:left; width:8%;');
    echo '<th style="border-bottom:1px solid #ccc; padding:8px; text-align:left; width:6%;">Edit</th>';
    echo '</tr></thead><tbody>';

    while ( $query->have_posts() ) {
        $query->the_post();
        $grant_id = get_the_ID();

        $funder   = get_field('funder', $grant_id);
        $priority_date = get_field('priority_date', $grant_id);

        // deadline display (ACF date Ymd -> "Month j, Y")
        $deadline_display = 'Not specified';

		if ( $priority_date ) {
			$dt = DateTime::createFromFormat('Ymd', (string) $priority_date);

			if ( $dt instanceof DateTime ) {
				$deadline_display = $dt->format('F j, Y');
			} else {
				$deadline_display = (string) $priority_date;
			}
		}

        // opportunity status names (taxonomy)
        $status_names = '';
        $terms = get_the_terms( $grant_id, $taxonomy_slug );
        if ( $terms && ! is_wp_error($terms) ) {
            $status_names = implode(', ', wp_list_pluck($terms, 'name'));
        } else {
            $acf_val = get_field('status', $grant_id);
            if ( $acf_val instanceof WP_Term ) {
                $status_names = $acf_val->name;
            } elseif ( is_array($acf_val) ) {
                if ( $acf_val && $acf_val[0] instanceof WP_Term ) {
                    $status_names = implode(', ', array_map(fn($t)=>$t->name, $acf_val));
                } else {
                    $term_objs = get_terms(['taxonomy'=>$taxonomy_slug,'include'=>array_map('intval',$acf_val),'hide_empty'=>false]);
                    if ( $term_objs && ! is_wp_error($term_objs) ) {
                        $status_names = implode(', ', wp_list_pluck($term_objs,'name'));
                    }
                }
            } elseif ( $acf_val ) {
                $t = get_term( (int) $acf_val, $taxonomy_slug );
                if ( $t && ! is_wp_error($t) ) $status_names = $t->name;
            }
        }

        // post status badge
        $post_status       = get_post_status( $grant_id );
        $ps_obj            = $post_status ? get_post_status_object($post_status) : null;
        $post_status_label = $ps_obj && ! empty($ps_obj->label) ? $ps_obj->label : ucfirst((string)$post_status);
        $badge = '<span style="display:inline-block;padding:2px 6px;border:1px solid #ccc;border-radius:4px;font-size:12px;">'
               . esc_html($post_status_label) . '</span>';

        // last modified display
        $modified_ts      = get_post_modified_time( 'U', true, $grant_id );
        $modified_display = $modified_ts ? date_i18n( 'F j, Y', $modified_ts ) : '';

        $view_url = get_permalink($grant_id);
        $edit_url = site_url('/edit-grant?post_id=' . $grant_id);

        echo '<tr>';
        echo '<td style="padding:8px;"><a href="'.esc_url($view_url).'" target="_blank" rel="noopener">'.esc_html(get_the_title()).'</a></td>';
        echo '<td style="padding:8px;">' . esc_html((string)$funder) . '</td>';
        echo '<td style="padding:8px;">' . esc_html($status_names) . '</td>';
        echo '<td style="padding:8px; white-space:nowrap;">' . esc_html($deadline_display) . '</td>';
        echo '<td style="padding:8px; white-space:nowrap;">' . esc_html($modified_display) . '</td>';
        echo '<td style="padding:8px;">' . $badge . '</td>';
        echo '<td style="padding:8px;"><a href="' . esc_url($edit_url) . '" class="edit-button" target="_blank" rel="noopener">Edit</a></td>';
        echo '</tr>';
    }

    echo '</tbody></table>';

    // ---------- PAGINATION ----------
    $total_pages = (int) $query->max_num_pages;
    if ( $total_pages > 1 ) {
        $base_no_pg = remove_query_arg('pg', $page_base);
        echo '<div class="grant-pagination" style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">';
        for ( $i = 1; $i <= $total_pages; $i++ ) {
            $url_with_pg   = add_query_arg( array_merge($_GET, ['pg' => $i]), $base_no_pg );
            $url_with_hash = $url_with_pg . '#'.$atts['anchor'];
            $is_current    = $i === $paged;
            echo '<a href="' . esc_url($url_with_hash) . '" data-hard-nav="1" ' .
                 'style="padding:6px 10px; border:1px solid #ccc; text-decoration:none; ' .
                 ( $is_current ? 'background:#eee; font-weight:600;' : '' ) . '">' .
                 $i . '</a>';
        }
        echo '</div>';
    }

    wp_reset_postdata();
    return ob_get_clean();
}
add_shortcode('grant_opportunity_table', 'display_grant_opportunities_table');




add_action('acf/frontend/form/submission', function($form, $post_id) {
    error_log('Form submitted: ' . $form['id']);
    error_log('New post ID: ' . $post_id);
}, 10, 2);


function funding_opportunity_edit_button() {
    if ( is_singular('funding_opportunity') && is_user_logged_in() && current_user_can('edit_posts') ) {
        $post_id = get_the_ID();
        $edit_url = site_url('/edit-grant/?post_id=' . $post_id);
        return '<a href="' . esc_url($edit_url) . '" class="edit-opportunity-button">Edit this Opportunity</a>';
    }
    return '';
}
add_shortcode('edit_opportunity_button', 'funding_opportunity_edit_button');

// [view_opportunity_link text="View this Opportunity →" class="view-oppty" target="_self"]
// NOT IN USE RIGHT NOW. CAN BE DELETED //

add_shortcode('view_opportunity_link', function($atts){
    $atts = shortcode_atts([
        'text'   => 'Cancel and View this Opportunity →',
        'class'  => 'view-opportunity-link',
        'target' => '',
    ], $atts, 'view_opportunity_link');

    $post_id = isset($_GET['post_id']) ? absint($_GET['post_id']) : 0;
    if (!$post_id) return '';

    // If published, go to the permalink; otherwise use a preview link.
    $status = get_post_status($post_id);
    $url = ($status === 'publish') ? get_permalink($post_id) : get_preview_post_link($post_id);

    $target = $atts['target'] ? ' target="'.esc_attr($atts['target']).'"' : '';

    return sprintf(
        '<a href="%s" class="%s"%s>%s</a>',
        esc_url($url),
        esc_attr($atts['class']),
        $target,
        esc_html($atts['text'])
    );
});


//Add a Hook to output "Not specified" when funding is empty or is zero

add_filter('acf/format_value', function($value, $post_id, $field) {
    $fields_to_check = ['total_funding_available', 'maximum_grant_award', 'funder', 'applications_due'];

    if (!in_array($field['name'], $fields_to_check, true)) {
        return $value;
    }

    // Default logic for most fields
    $is_emptyish = (empty($value) || (is_numeric($value) && (int)$value === 0));

    // Handle everything except applications_due
    if ($field['name'] !== 'applications_due') {
        return $is_emptyish ? 'Not specified' : $value;
    }

    // ---- Special handling for applications_due ----

    // 1) Resolve a proper numeric post ID if possible
    $resolved_id = null;
    if (is_numeric($post_id)) {
        $resolved_id = (int) $post_id;
    } else {
        // Try to use the current global $post or the queried object
        $global_post_id = (function () {
            global $post;
            return (isset($post->ID) && is_numeric($post->ID)) ? (int) $post->ID : null;
        })();
        $qo_id = function_exists('get_queried_object_id') ? (int) get_queried_object_id() : null;

        $resolved_id = $global_post_id ?: ($qo_id ?: null);
    }

    // If we can't resolve a post ID, don't incorrectly label it as "Not specified"
    if (!$resolved_id) {
        return $value;
    }

    // 2) Detect if the post has any open_period term(s)
    $has_open_period = false;

    // Try common variations of the taxonomy slug just in case
    $candidate_tax_slugs = ['open_period', 'open-period'];

    foreach ($candidate_tax_slugs as $tax_slug) {
        $terms = get_the_terms($resolved_id, $tax_slug);
        if (!is_wp_error($terms) && !empty($terms)) {
            $has_open_period = true;
            break;
        }
    }

    // 3) Fallback: if open_period is stored via an ACF taxonomy field, read its raw value
    if (!$has_open_period) {
        // Pass false as the 3rd arg to get raw term IDs instead of formatted labels/objects
        $acf_tax_raw = function_exists('get_field') ? get_field('open_period', $resolved_id, false) : null;
        if (!empty($acf_tax_raw)) {
            // Could be a single ID or an array of IDs
            if (is_array($acf_tax_raw)) {
                $has_open_period = count(array_filter($acf_tax_raw)) > 0;
            } else {
                $has_open_period = !empty($acf_tax_raw);
            }
        }
    }

    // 4) Now decide the output
    // If applications_due is empty-ish AND there is NO open_period, show "Not specified"
	if ($is_emptyish && !$has_open_period) {
        return 'Not specified';
    }
	
	// 5) If we have a Ymd date value, format it for display
    // Accept only 8-digit strings like 20260331
    if (!empty($value) && is_string($value) && preg_match('/^\d{8}$/', $value)) {
        $dt = DateTime::createFromFormat('Ymd', $value);
        if ($dt instanceof DateTime) {
            // Pick your display format here:
            return $dt->format('F j, Y'); // e.g. March 31, 2026
            // return $dt->format('M j, Y'); // e.g. Mar 31, 2026
            // return $dt->format('Y-m-d');  // e.g. 2026-03-31
        }
    }

    // Otherwise, return the (possibly empty) value so your UI can show the open period instead
    return $value;

}, 10, 3);

// Save as Draft of Publish Funding Opportunities
/**
 * Force final post_status after Frontend Admin saves the post.
 */
add_action('frontend_admin/save_post', function ($form, $post_id) {
    // Only for this CPT
    if (get_post_type($post_id) !== 'grant_opportunity') return;

    /* ---- 1) Resolve the intended status ---- */
    $status = $form['record']['post']['post_status'] ?? null;

    // Fallback to the posted ACF/FA radio by KEY (FA uses "acff" namespace)
    if (!$status) {
        $postArr = $_POST['acff']['post'] ?? ($_POST['acf']['post'] ?? []);
        if (isset($postArr['field_68b09acfea568'])) { // <-- your "Submission Status" field key
            $status = sanitize_text_field($postArr['field_68b09acfea568']);
        }
    }

    $allowed = ['draft','publish','pending'];
    if (!in_array($status, $allowed, true)) $status = 'draft';
    if ($status === 'publish' && !current_user_can('publish_posts')) $status = 'pending';

    // Enforce status AFTER FA saves
    wp_update_post(['ID'=>$post_id, 'post_status'=>$status]);

    /* ---- 2) Decide where to go ---- */
    $action     = isset($_POST['tecc_action']) ? sanitize_text_field($_POST['tecc_action']) : '';
    $permalink  = get_permalink($post_id);
    $tracker    = 'https://socaltecc.org/opportunity-tracker/';
    // Your front-end edit route (adjust if different)
    $front_edit = 'https://socaltecc.org/edit-grant/?post_id=' . $post_id;

    // If user hit Publish & can publish → view public post
    if ($action === 'publish_view' && $status === 'publish') {
        wp_safe_redirect($permalink); exit;
    }

    // If user hit Save as Draft → for NEW or EDIT both, send to the front-end edit screen of THIS post
    if ($action === 'draft_stay') {
        wp_safe_redirect($front_edit); exit;
    }

    // Fallback: go back or to tracker
    $referer = wp_get_referer();
    wp_safe_redirect($referer ?: $tracker); exit;
}, 99, 2);


// Add classes to show/hide sections of the Funding Opportunity post
add_filter('post_class', function($classes, $class, $post_id){
    // Only target your Funding Opportunity CPT
    if (get_post_type($post_id) === 'funding_opportunity') {
        
        // Add classes for Opportunity Status terms
        $status_terms = get_the_terms($post_id, 'opportunity-status'); // or 'status'
        if ($status_terms && !is_wp_error($status_terms)) {
            foreach ($status_terms as $t) {
                $classes[] = 'opportunity-status--' . sanitize_html_class($t->slug);
            }
        }

        // Add classes for Funding Type terms
        $funding_terms = get_the_terms($post_id, 'funding-type'); 
        if ($funding_terms && !is_wp_error($funding_terms)) {
            foreach ($funding_terms as $t) {
                $classes[] = 'funding-type--' . sanitize_html_class($t->slug);
            }
        }

        // Add class if Funding Source taxonomy has terms
        $source_terms = get_the_terms($post_id, 'funding-source'); 
        if ($source_terms && !is_wp_error($source_terms)) {
            $classes[] = 'has-funding-source';
            foreach ($source_terms as $t) {
                $classes[] = 'funding-source--' . sanitize_html_class($t->slug);
            }
        } else {
            $classes[] = 'no-funding-source';
        }
    }

    return $classes;
}, 10, 3);




// Add script to resize the WYSIWG text editing fields in the Opportunity Tracker
add_action('wp_enqueue_scripts', function () {
  if (!is_page('opportunity-tracker')) return; // or use the page ID
  wp_enqueue_script(
    'acf-wysiwyg-resize',
    get_stylesheet_directory_uri() . '/acf-wysiwyg-resize.js',
    ['jquery'],
    null,
    true
  );
});


/**
 * ACF: normalize 'funding_type' to a safe, printable string for display.
 * Prevents fatals when widgets try to echo WP_Term objects or mixed arrays.
 */
add_filter('acf/format_value/name=funding_type', function ($value, $post_id, $field) {
    if (empty($value)) {
        return ''; // truly empty -> Elementor conditionals won't show the block
    }

    $names = [];

    $push = static function ($v) use (&$names) {
        if ($v instanceof WP_Term) {
            $names[] = $v->name;
        } elseif (is_numeric($v)) {
            $t = get_term((int)$v);
            if ($t && !is_wp_error($t)) {
                $names[] = $t->name;
            }
        } elseif (is_string($v) && trim($v) !== '') {
            // Some setups already return term names
            $names[] = $v;
        }
        // ignore anything else/null
    };

    if (is_array($value)) {
        foreach ($value as $item) $push($item);
    } else {
        $push($value);
    }

    return $names ? implode(', ', array_unique($names)) : '';
}, 10, 3);

// (Optional belt-and-suspenders) also attach by field KEY if you like:
// add_filter('acf/format_value/key=FIELD_KEY_HERE', function($v,$p,$f){ return apply_filters('acf/format_value/name=funding_type',$v,$p,$f); }, 10, 3);



// When saving Funding Opportunities, treat "<br>", "<p><br></p>", "&nbsp;" and whitespace-only HTML as empty.

function tecc_is_html_visually_empty( $html ) {
    if (!is_string($html)) return false;

    // Decode &nbsp; and friends
    $s = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // Strip script/style blocks if any
    $s = preg_replace('#<(script|style)[^>]*>.*?</\1>#si', '', $s);

    // Remove common "empty" markup: <br>, <hr>, empty paragraphs/divs/spans
    $s = preg_replace('#<(?:br|hr)\s*/?>#i', '', $s);
    $s = preg_replace('#<p[^>]*>\s*</p>#i', '', $s);
    $s = preg_replace('#<div[^>]*>\s*</div>#i', '', $s);
    $s = preg_replace('#<span[^>]*>\s*</span>#i', '', $s);

    // Collapse non-breaking spaces to normal spaces
    $s = str_replace(["\xc2\xa0", '&nbsp;', '&#160;'], ' ', $s);

    // Final plain-text check
    $plain = trim( wp_strip_all_tags( $s, true ) );

    return ($plain === '');
}

/**
 * ACF: normalize visually-empty fields to an actual empty string before save.
 * Add your field names to $targets.
 */
add_filter('acf/update_value', function ($value, $post_id, $field) {

    // Add the ACF field *names* that should be normalized
    $targets = [
        'eligibility',
        'eligible_activities',
        'notable_requirements',
        'preferences',
        'how_to_apply',
        'grant_period', // include any other text/WYSIWYG fields you use
    ];

    if (in_array($field['name'], $targets, true) && is_string($value)) {
        if (tecc_is_html_visually_empty($value)) {
            return ''; // store truly empty → Elementor "Is not Empty" will now be false
        }
    }

    return $value;
}, 10, 3);




// Force ACF's Select2 and remove duplicates on front-end forms
add_action('wp_enqueue_scripts', function () {
    // Common handles other plugins use
    $handles = ['select2', 'select2-js', 'select2-full', 'elementor-select2'];
    foreach ($handles as $h) {
        wp_dequeue_script($h);
        wp_dequeue_style($h);
    }
    // Ensure ACF input assets (includes its Select2 adapter) are present
    if (class_exists('ACF')) {
        wp_enqueue_script('acf-input');
        wp_enqueue_style('acf-input');
    }
}, 100);


// Statewide Offerings Meetings Custom Post Type

function register_meeting_recording_cpt() {
    $labels = array(
        'name' => 'Meetings',
        'singular_name' => 'Meeting Recording',
        'add_new_item' => 'Add New Meeting Recording',
        'edit_item' => 'Edit Meeting Recording',
        'new_item' => 'New Meeting Recording',
        'view_item' => 'View Meeting Recording',
        'search_items' => 'Search Meetings',
        'menu_name' => 'Meetings'
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'meetings'),
        'menu_icon' => 'dashicons-video-alt3',
        'supports' => array('title', 'editor', 'thumbnail'),
        'show_in_rest' => true,
    );

    register_post_type('meeting_recording', $args);
}
add_action('init', 'register_meeting_recording_cpt');

// Register the taxonomy for the Meetings CPT
function tecc_register_meeting_taxonomies() {
    // === Meeting Topic (category-like) ===
    $labels = array(
        'name'              => 'Meeting Categories',
        'singular_name'     => 'Meeting Category',
        'search_items'      => 'Search Meeting Categories',
        'all_items'         => 'All Meeting Categories',
        'edit_item'         => 'Edit Meeting Categories',
        'update_item'       => 'Update Meeting Category',
        'add_new_item'      => 'Add New Meeting Category',
        'new_item_name'     => 'New Meeting Category',
        'menu_name'         => 'Meeting Categories',
    );

    register_taxonomy(
        'meeting_category', // taxonomy slug
        array('meeting_recording'), // the CPT slug
        array(
            'labels'            => $labels,
            'hierarchical'      => true,               // behaves like categories
            'public'            => true,
            'show_ui'           => true,
            'show_in_rest'      => true,               // needed for Elementor/UE
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'meeting-category'), // /meeting-topic/<term>/
        )
    );
}
add_action('init', 'tecc_register_meeting_taxonomies');

// Add a global "Meeting Settings" page under the Meetings CPT menu
function meetings_add_settings_submenu() {
    add_submenu_page(
        'edit.php?post_type=meeting_recording', 
        'Meeting Settings',
        'Meeting Settings',
        'edit_posts',
        'meeting-settings',
        'meetings_render_settings_page'
    );
}
add_action('admin_menu', 'meetings_add_settings_submenu');

// Register the global meeting passcode setting
function meetings_register_settings() {
    register_setting(
        'meetings_settings_group',
        'video_recordings_passcode',
        array(
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default'           => ''
        )
    );
}
add_action('admin_init', 'meetings_register_settings');

// Render the Meeting Settings admin page
function meetings_render_settings_page() {
    ?>
    <div class="wrap">
        <h1>Meeting Settings</h1>

        <form method="post" action="options.php">
            <?php settings_fields('meetings_settings_group'); ?>
            <?php do_settings_sections('meetings_settings_group'); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">
                        <label for="video_recordings_passcode">Video Recordings Passcode</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="video_recordings_passcode"
                            name="video_recordings_passcode"
                            value="<?php echo esc_attr(get_option('video_recordings_passcode', '')); ?>"
                            class="regular-text"
                        />
                        <p class="description">
                            This passcode will be available globally on all Meeting Recording pages.
                        </p>
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Shortcode to display the Meetings Passcode. Shortcode: [meeting_passcode]

function meeting_passcode_shortcode() {
    $passcode = get_option('video_recordings_passcode', '');

    if (!$passcode) {
        return '';
    }

    return '<div class="meeting-passcode"><strong>Recording passcode:</strong> ' . esc_html($passcode) . '</div>';
}
add_shortcode('meeting_passcode', 'meeting_passcode_shortcode');



// Shortcode to display the linked files attached to a Meeting Recording CPT
// Shortcode: [meeting_files_list]

function display_meeting_files() {
    $post_id = get_the_ID();

    if (!$post_id) {
        return '';
    }

    // Explicit order for output
    $groups = array(
        'presentation_slides',
        'transcript',
        'attached_resource_1',
        'attached_resource_2',
        'attached_resource_3'
    );

    $output   = '';
    $hasItems = false;

    foreach ($groups as $group_name) {
        $group = get_field($group_name, $post_id);

        if (empty($group) || !is_array($group)) {
            continue;
        }

        $url   = '';
        $label = '';

        // Prefer uploaded file if present
        if (!empty($group['file'])) {
            $file = $group['file'];

            // File returned as attachment ID
            if (is_numeric($file)) {
                $url = wp_get_attachment_url($file);
                $label = get_the_title($file);
            }
            // File returned as array
            elseif (is_array($file) && !empty($file['url'])) {
                $url = $file['url'];
                $label = !empty($file['title']) ? $file['title'] : basename(parse_url($url, PHP_URL_PATH));
            }
            // File returned as URL string
            elseif (is_string($file)) {
                $url = $file;
                $label = basename(parse_url($url, PHP_URL_PATH));
            }
        }

        // If no uploaded file, fall back to Link URL
        if (!$url && !empty($group['link_url'])) {
            $url = $group['link_url'];
            $host = parse_url($url, PHP_URL_HOST);
            $path = basename(parse_url($url, PHP_URL_PATH) ?: '');
            $label = $host ?: $path ?: $url;
        }

        // Override label with custom resource name if provided
        if (!empty($group['file_name'])) {
            $label = $group['file_name'];
        }

        // Skip if still no usable URL
        if (!$url) {
            continue;
        }

        if (!$hasItems) {
            $output .= '<div class="meeting-files"><h3>Resources</h3><ul>';
            $hasItems = true;
        }

        $output .= '<li><a href="' . esc_url($url) . '" target="_blank" rel="noopener">' . esc_html($label) . '</a></li>';
    }

    if ($hasItems) {
        $output .= '</ul></div>';
    }

    return $output;
}
add_shortcode('meeting_files_list', 'display_meeting_files');


function meeting_video_embed_shortcode() {
    $url = get_field('meeting_video_url');
    if (!$url) return '';

    $url = trim($url);

    // Let WP handle Vimeo/YouTube/etc via oEmbed
    $html = wp_oembed_get($url);

    // Fallback: Vimeo iframe if oEmbed fails
    if (!$html && preg_match('~vimeo\.com/(?:video/)?(\d+)~', $url, $m)) {
        $id = $m[1];
        $html = sprintf(
            '<iframe src="https://player.vimeo.com/video/%1$s" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>',
            esc_attr($id)
        );
    }

    if (!$html) return '';

    return '<div class="meeting-video-embed">'.$html.'</div>';
}
add_shortcode('meeting_video', 'meeting_video_embed_shortcode');


// Add a search results listing

add_shortcode('funding_search_results', function () {
  $q_raw = isset($_GET['q']) ? wp_unslash($_GET['q']) : '';
  $q = trim(sanitize_text_field($q_raw));

  if ($q === '') {
    return '<p>Enter a search term to see results.</p>';
  }


  // Pagination (optional)
  $paged = isset($_GET['pg']) ? max(1, (int) $_GET['pg']) : 1;

  // Helpers
  $fmt_money = function ($n) {
    if ($n === '' || $n === null) return 'Not specified';
    if (!is_numeric($n)) return esc_html($n);
    return '$' . number_format((float)$n, 0);
  };

  $fmt_date = function ($d) {
    // ACF Date Picker can return Ymd, Y-m-d, or formatted depending on field settings.
    if (empty($d)) return 'Not specified';

    // Normalize common formats
    $d = (string)$d;

    // Ymd (e.g. 20260331)
    if (preg_match('/^\d{8}$/', $d)) {
      $dt = DateTime::createFromFormat('Ymd', $d);
      return $dt ? $dt->format('F j, Y') : $d;
    }

    // Y-m-d
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) {
      $dt = DateTime::createFromFormat('Y-m-d', $d);
      return $dt ? $dt->format('F j, Y') : $d;
    }

    // Already formatted
    return $d;
  };

  $trim_wysiwyg = function ($html, $words = 44) {
    if (empty($html)) return '';
    $text = wp_strip_all_tags($html);
    return wp_trim_words($text, $words, '…');
  };

	 // ---- Highlight helper ----
  if (!function_exists('tecc_highlight_search_terms')) {
    function tecc_highlight_search_terms($text, $raw_query) {
      $text = (string) $text;

      $raw_query = trim((string) $raw_query);
      if ($raw_query === '') return $text;

      $terms = preg_split('/\s+/', $raw_query, -1, PREG_SPLIT_NO_EMPTY);
      if (!$terms) return $text;

      $escaped = array_map(function($t){
        return preg_quote($t, '/');
      }, $terms);

      $pattern = '/(' . implode('|', $escaped) . ')/i';

      return preg_replace($pattern, '<mark class="search-highlight">$1</mark>', $text);
    }
  }

// --- Find IDs that match taxonomy terms ---
$taxonomies_to_search = [
  'funding_source',
  'funding-type',
  'topic',
  'opportunity_status',
  'maximum_award_range',
];

$tax_query = ['relation' => 'OR'];
foreach ($taxonomies_to_search as $tax) {
  $tax_query[] = [
    'taxonomy' => $tax,
    'field'    => 'name',
    'terms'    => $q,
    'operator' => 'LIKE',
  ];
}

// Get IDs from taxonomy matches
$tax_ids = get_posts([
  'post_type'      => 'funding_opportunity',
  'post_status'    => 'publish',
  'fields'         => 'ids',
  'posts_per_page' => -1,
  'tax_query'      => $tax_query,
]);

// --- Find IDs that match ACF/meta fields ---
$meta_keys_to_search = [
  'funder',
  'purpose',
  'program',
  'opportunity_website',
  'solicitation_website',
  'solicitation_notes',
  'applications_due_note',
  'total_funding_note',
  'award_amount_notes',
  'eligibility',
  'eligible_activities',
  'grant_period',
  'notable_requirements',
  'preferences',
  'how_to_apply',
];

$meta_query = ['relation' => 'OR'];
foreach ($meta_keys_to_search as $k) {
  $meta_query[] = [
    'key'     => $k,
    'value'   => $q,
    'compare' => 'LIKE',
  ];
}

// Get IDs from meta matches
$meta_ids = get_posts([
  'post_type'      => 'funding_opportunity',
  'post_status'    => 'publish',
  'fields'         => 'ids',
  'posts_per_page' => -1,
  'meta_query'     => $meta_query,
]);

// --- Find IDs from the regular WP search (title/content/excerpt) ---
$search_ids = get_posts([
  'post_type'      => 'funding_opportunity',
  'post_status'    => 'publish',
  'fields'         => 'ids',
  'posts_per_page' => -1,
  's'              => $q,
]);

// Merge and dedupe
$all_ids = array_values(array_unique(array_merge($search_ids, $tax_ids, $meta_ids)));

if (empty($all_ids)) {
  return '<p>No matching funding opportunities found.</p>';
}

// Now query ONLY those IDs (and paginate nicely)
$args = [
  'post_type'      => 'funding_opportunity',
  'post_status'    => 'publish',
  'post__in'       => $all_ids,
  'orderby'        => 'post__in',
  'posts_per_page' => 10,
  'paged'          => $paged,
];

$query = new WP_Query($args);


  ob_start();
	
// Legend (prints above results)
  echo '<h2 class="funding-search-legend">Search Results for: <span class="funding-search-term">' . esc_html($q) . '</span></h2>';

  if ($query->have_posts()) {
    echo '<div class="funding-search-results">';

    while ($query->have_posts()) {
      $query->the_post();
      $post_id = get_the_ID();

      // ACF fields 
      $funder                 = get_field('funder', $post_id);
      $overview_html          = get_field('purpose', $post_id);
      $applications_due_raw   = get_field('applications_due', $post_id);
      $total_funding_raw      = get_field('total_funding_available', $post_id);
      $max_award_raw          = get_field('maximum_grant_award', $post_id);

      // Format for display
      $applications_due = $fmt_date($applications_due_raw);
      $total_funding    = $fmt_money($total_funding_raw);
      $max_award        = $fmt_money($max_award_raw);
      $funder_display   = !empty($funder) ? $funder : 'Not specified';
      $overview         = $trim_wysiwyg($overview_html, 50);
		
	  // Highlight the searched keywords before displaying them
	  $applications_due_highlighted = tecc_highlight_search_terms(esc_html($applications_due), $q);
	  $total_funding_highlighted    = tecc_highlight_search_terms(esc_html($total_funding), $q);
	  $max_award_highlighted        = tecc_highlight_search_terms(esc_html($max_award), $q);
	  $funder_highlighted           = tecc_highlight_search_terms(esc_html($funder_display), $q);
		
	  // Title highlight (escape first, then inject <mark>)
      $title_plain = get_the_title();
      $title_safe  = esc_html($title_plain);
      $title_mark  = tecc_highlight_search_terms($title_safe, $q);

      echo '<article class="funding-result">';
        echo '<h3 class="funding-result__title"><a href="' . esc_url(get_permalink()) . '">' . $title_mark . '</a></h3>';

        echo '<ul class="funding-result__meta">';
          echo '<li><span class="funding-result__label">Applications Due:</span> <span class="funding-result__value">' . $applications_due_highlighted . '</span></li>';
echo '<li><span class="funding-result__label">Total Funding Available:</span> <span class="funding-result__value">' . $total_funding_highlighted . '</span></li>';
echo '<li><span class="funding-result__label">Maximum Award:</span> <span class="funding-result__value">' . $max_award_highlighted . '</span></li>';
echo '<li><span class="funding-result__label">Funder:</span> <span class="funding-result__value">' . $funder_highlighted . '</span></li>';
        echo '</ul>';

       $overview_highlighted = tecc_highlight_search_terms(esc_html($overview), $q);

		if (!empty($overview)) {
		  echo '<p class="funding-result__overview">' . $overview_highlighted . '</p>';
		}

      echo '</article>';
    }

    echo '</div>';

    // Simple pagination (optional)
    $total_pages = (int) $query->max_num_pages;
    if ($total_pages > 1) {
      $base = remove_query_arg('pg');
      echo '<nav class="funding-results__pagination" aria-label="Search results pages">';
      for ($i = 1; $i <= $total_pages; $i++) {
        $url = add_query_arg('pg', $i, $base);
        if ($i === $paged) {
          echo '<span class="page is-current" aria-current="page">' . (int)$i . '</span>';
        } else {
          echo '<a class="page" href="' . esc_url($url) . '">' . (int)$i . '</a>';
        }
      }
      echo '</nav>';
    }

  } else {
    echo '<p>No matching funding opportunities found.</p>';
  }

  wp_reset_postdata();
  return ob_get_clean();
});





// Hide Funding Opportunities search results listing for non-logged in users

add_action('template_redirect', function () {
  if (is_page('funding-opportunities-search-result') && !is_user_logged_in()) {
    wp_safe_redirect(wp_login_url(get_permalink()));
    exit;
  }
});

// Prefill values in the Opportunity Tracker admin page

// Force default Topics for new Opportunity posts (Taxonomy field)
add_filter('acf/load_value/name=topic', function ($value, $post_id, $field) {

  // Only if empty (so we don't overwrite saved values)
  if (!empty($value)) return $value;

  // ACF sometimes uses "new_post" for create forms
  if ($post_id === 'new_post') {
    return [52, 53]; // <-- your Topic term IDs
  }

  // If ACF plugin uses a different "new" post_id
  if (!is_numeric($post_id)) {
    return [52, 53];
  }

  return $value;
}, 10, 3);


/**
 * Compute priority_date for Funding Opportunities.
 * Sort preference:
 * 1) opens_on
 * 2) pre_application_deadline
 * 3) applications_due
 * 4) open_until
 * 5) ongoing (mapped far future)
 */


add_action('acf/save_post', function ($post_id) {
  if (!is_numeric($post_id)) return;
  if (get_post_type($post_id) !== 'funding_opportunity') return;
  if (!function_exists('get_field')) return;

  // Pull ACF values
  $opens_on   = get_field('opens_on', $post_id);
  $preapp     = get_field('pre-application_deadline', $post_id); // your hyphenated field name
  $due        = get_field('applications_due', $post_id);
  $open_until = get_field('open_until', $post_id);
  $ongoing    = (bool) get_field('ongoing', $post_id);

  // Admin override
  $mode = get_field('priority_date_mode', $post_id);
  if (!$mode) $mode = 'auto';

  // Convert various date inputs to sortable YYYYMMDD
  $to_ymd = function ($val) {
    if (!$val) return '';
    if (is_string($val) && preg_match('/^\d{8}$/', $val)) return $val; // already Ymd
    if ($val instanceof DateTime) return $val->format('Ymd');
    $ts = strtotime((string)$val);
    return $ts ? date('Ymd', $ts) : '';
  };

  $ymd_to_pretty = function ($ymd) {
    if (!is_string($ymd) || !preg_match('/^\d{8}$/', $ymd)) return '';
    $dt = DateTime::createFromFormat('Ymd', $ymd);
    return ($dt instanceof DateTime) ? $dt->format('F j, Y') : '';
  };

  // IMPORTANT: normalize mode so hyphen/underscore both work
  $mode_norm = is_string($mode) ? str_replace('-', '_', $mode) : $mode;

  $priority = '';
  $resolved_mode_norm = $mode_norm;

  // Helper map: normalized mode -> raw field value
  $mode_to_value = [
    'opens_on'                 => $opens_on,
    'pre_application_deadline' => $preapp,
    'applications_due'         => $due,
    'open_until'               => $open_until,
  ];

  if ($mode_norm !== 'auto') {
    if ($mode_norm === 'ongoing') {
      $priority = '20991231';
    } else if (isset($mode_to_value[$mode_norm])) {
      $priority = $to_ymd($mode_to_value[$mode_norm]);
    } else {
      $priority = '';
    }
  } else {
    // Auto priority order
    if ($opens_on) {
      $priority = $to_ymd($opens_on);
      $resolved_mode_norm = 'opens_on';
    } else if ($preapp) {
      $priority = $to_ymd($preapp);
      $resolved_mode_norm = 'pre_application_deadline';
    } else if ($due) {
      $priority = $to_ymd($due);
      $resolved_mode_norm = 'applications_due';
    } else if ($open_until) {
      $priority = $to_ymd($open_until);
      $resolved_mode_norm = 'open_until';
    } else if ($ongoing) {
      $priority = '20991231';
      $resolved_mode_norm = 'ongoing';
    } else {
      $priority = '';
      $resolved_mode_norm = 'auto';
    }
  }

  // Store sortable priority date (used for sorting)
  update_post_meta($post_id, 'priority_date', $priority);

  // Display label for the effective mode
  $mode_labels = [
    'opens_on'                 => 'Opens on',
    'pre_application_deadline' => 'Pre-application deadline',
    'applications_due'         => 'Application deadline',
    'open_until'               => 'Open until',
    'ongoing'                  => 'Ongoing',
    'auto'                     => '',
  ];

  $mode_label = $mode_labels[$resolved_mode_norm] ?? '';
  update_post_meta($post_id, 'priority_date_mode_display', $mode_label);

  // Combined display string
  $display = '';
  if ($resolved_mode_norm === 'ongoing') {
    $display = 'Ongoing';
  } else if ($priority) {
    $pretty = $ymd_to_pretty($priority);
    if ($pretty) {
      $display = ($mode_label ? ($mode_label . ': ') : 'Priority date: ') . $pretty;
    }
  }
  update_post_meta($post_id, 'priority_date_display', $display);

}, 20);


// Save 'Open Period' taxonomy as string instead of Array
add_action('save_post_funding_opportunity', function ($post_id) {
  if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) return;

  $tax = 'open-period'; 
  $slugs = wp_get_object_terms($post_id, $tax, ['fields' => 'slugs']);

  update_post_meta(
    $post_id,
    'open_period_str',
    (is_wp_error($slugs) || empty($slugs)) ? '' : implode(', ', $slugs)
  );
}, 20);

// Filter for Single Events

add_filter( 'body_class', function( $classes ) {
    if ( ! function_exists( 'tribe_get_organizer_ids' ) ) {
        return $classes;
    }
    $organizer_ids = tribe_get_organizer_ids();
    if ( empty( $organizer_ids ) ) {
        return $classes;
    }
    $organizer_id = $organizer_ids[0];

    if ( empty( tribe_get_organizer_phone( $organizer_id ) ) ) {
        $classes[] = 'no-organizer-phone';
    }
    if ( empty( tribe_get_organizer_email( $organizer_id ) ) ) {
        $classes[] = 'no-organizer-email';
    }
    if ( empty( tribe_get_organizer_website_link( $organizer_id ) ) ) {
        $classes[] = 'no-organizer-website';
    }

    return $classes;
} );

// Shortcode to display Event dates
add_shortcode('event_start_date', function () {
    if ( get_post_type() !== 'tribe_events' ) {
        return '';
    }

    $start_date = get_post_meta(get_the_ID(), '_EventStartDate', true);

    if ( empty($start_date) ) {
        return '';
    }

    return date_i18n('M j, Y', strtotime($start_date));
});

