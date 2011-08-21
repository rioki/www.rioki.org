module Jekyll
  module Filters
    def summarize(str, splitstr = "<!--more-->")
      str.split(splitstr)[0]
    end
  end
end