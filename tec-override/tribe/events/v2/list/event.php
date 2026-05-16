<?php
/**
 * View: List Event
 *
 * Override this template in your own theme by creating a file at:
 * [your-theme]/tribe/events/v2/list/event.php
 *
 * See more documentation about our views templating system.
 *
 * @link http://evnt.is/1aiy
 *
 * @version 5.0.0
 *
 * @var WP_Post $event The event post object with properties added by the `tribe_get_event` function.
 *
 * @see tribe_get_event() For the format of the event object.
 */

$container_classes = [ 'tribe-common-g-row', 'tribe-events-calendar-list__event-row' ];
$container_classes['tribe-events-calendar-list__event-row--featured'] = $event->featured;

$event_classes = tribe_get_post_class( [ 'tribe-events-calendar-list__event', 'tribe-common-g-row', 'tribe-common-g-row--gutters' ], $event->ID );
$organizer_names = [];

if ( function_exists( 'tribe_get_organizer_ids' ) ) {
	$organizer_ids = tribe_get_organizer_ids( $event->ID );

	foreach ( $organizer_ids as $organizer_id ) {
		if ( post_password_required( $organizer_id ) ) {
			continue;
		}

		$organizer_name = get_the_title( $organizer_id );

		if ( $organizer_name ) {
			$organizer_names[] = $organizer_name;
		}
	}
}
?>
<li <?php tec_classes( $container_classes ); ?>>

	<?php $this->template( 'list/event/date-tag', [ 'event' => $event ] ); ?>

	<div class="tribe-events-calendar-list__event-wrapper tribe-common-g-col">
		<article <?php tec_classes( $event_classes ); ?>>
			<?php $this->template( 'list/event/featured-image', [ 'event' => $event ] ); ?>

			<div class="tribe-events-calendar-list__event-details tribe-common-g-col">

				<header class="tribe-events-calendar-list__event-header">
					<?php $this->template( 'list/event/title', [ 'event' => $event ] ); ?>
					<?php $this->template( 'list/event/date', [ 'event' => $event ] ); ?>
					<?php $this->template( 'list/event/venue', [ 'event' => $event ] ); ?>
					<?php if ( $organizer_names ) : ?>
						<div class="tribe-events-calendar-list__event-organizer tribe-common-b2">
							<span class="tribe-events-calendar-list__event-organizer-label tribe-common-b2--bold">
								<?php esc_html_e( 'Organized by:', 'hello-elementor-child' ); ?>
							</span>
							<span class="tribe-events-calendar-list__event-organizer-name">
								<?php echo esc_html( implode( ', ', array_unique( $organizer_names ) ) ); ?>
							</span>
						</div>
					<?php endif; ?>
					<?php $this->template( 'list/event/category', [ 'event' => $event ] ); ?>
				</header>

				<?php $this->template( 'list/event/description', [ 'event' => $event ] ); ?>
				<?php $this->template( 'list/event/cost', [ 'event' => $event ] ); ?>

			</div>
		</article>
	</div>

</li>
