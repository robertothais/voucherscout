class PagesController < ApplicationController
  before_action :set_meta_tag_data

  def home
    @last_run = SynchronizationRun.latest
    @page_title = 'Find and redeem Ticketmaster voucher shows you can see for free'
    @events = Event.order_by(time: 'asc').all
  end

  def about
    @page_title = 'About'
  end

  def subscribe
    if params[:email].present? && Subscription.create(email: params[:email])
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def set_meta_tag_data
    set_meta_tags(
      description: 'A fast and friendly alternative that finds you free shows redeemable with Ticketmaster settlement vouchers.'
    )
  end
end
