class HomeController < ApplicationController
	def index
		session_id = session[:session_id]
		@result = session_id
	end
end
