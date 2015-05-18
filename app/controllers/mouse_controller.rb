class MouseController < WebsocketRails::BaseController

	def initialize_session
		# perform application setup here
		controller_store[:mice] = Hash.new
		# controller_store[:mice] = [{:connection_id => "bb17b19878bff02f35f9",:x => 50, :y => 252}]
	end

	def mouse_move		
		controller_store[:mice] = controller_store[:mice].delete_if do |key, value| value[:last_updated].to_i < Time.now.to_i - 25 end 

		message[:color] = get_color message[:connection_id]
		message[:last_updated] = Time.now.to_i
		controller_store[:mice][message[:connection_id]] = message

		data = Hash.new
		data[:mice] = controller_store[:mice]
		data[:online] = controller_store[:mice].length

		broadcast_message :mice_update, data
	end

	def new_mouse
		if message[:connection_id] != ""
			message[:last_updated] = Time.now.to_i
			controller_store[:mice][message[:connection_id]] = message
		end
	end

	def remove_mouse
		#TODO: Remove connection_id from @mice array
		#controller_store[:mice] = controller_store[:mice].delete_if do |key| key == connection.id end 
	end

	private
	def get_color id
		return '#' + id[0..5]
	end
end
