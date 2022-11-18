<?php if ($apply = get_the_job_application_method() ) :
    wp_enqueue_script('wp-job-manager-job-application');
    ?>
	<?php do_action('job_application_start', $apply); ?>

		<div class="pagehead-button">
			<a class="btn btn-primary btn-lg" data-toggle="modal" data-target="#singlejobapply"><?php esc_html_e('Apply for a job.', 'robojob-lite'); ?></a>
		</div>

		<!-- Modal -->
		<div class="modal fade" id="singlejobapply" tabindex="-1" role="dialog" >
			<div class="modal-dialog" role="document">
		    	<div class="modal-content">
					<div class="modal-header">
						<a href="#" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></a>
						<h4 class="modal-title"><?php esc_html_e('Apply for a job.', 'robojob-lite'); ?></h4>
					</div>
					<div class="modal-body">
						<div class="application_details_ontop">
		  					<?php
                                /**
                                 * job_manager_application_details_email or job_manager_application_details_url hook.
                                 */
                                do_action('job_manager_application_details_'.$apply->type, $apply);
                            ?>
		  				</div>
		      		</div>
		    	</div>
		  	</div>
		</div>

	<?php do_action('job_application_end', $apply); ?>
<?php endif; ?>
