class Api::SubscriptionsController < ApplicationController
  def index
    @subscriptions = Subscription.all
    render json: @subscriptions
  end

  def create
    @subscription = Subscription.new(subscription_params)
    if @subscription.save
      channel = @subscription.channel
      Pusher.trigger("channels", "subscriptions_changed", {})

      @user = User.find(subscription_params[:user_id])
      render json: @user
    else
      render json: @subscription.errors.full_messages, status: 422
    end
  end

  def destroy
    @subscription = Subscription.find(params[:id])
    channel = @subscription.channel

    @subscription.destroy
    render :index

    Pusher.trigger(channel.id.to_s, "subscriptions_changed", {})
  end

  private
  def subscription_params
    params.require(:subscription).permit(:user_id, :channel_id)
  end
end

#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  channel_id :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
