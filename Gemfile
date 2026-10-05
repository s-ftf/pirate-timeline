source "https://rubygems.org"

ruby ">= 3.2", "< 4.0"

gem "jekyll", "~> 4.4.1"
# Declare the standard-library gems used by Liquid and Jekyll explicitly.
gem "bigdecimal", "~> 4.1"
gem "logger", "~> 1.7"

platforms :windows, :jruby do
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data"
end

# Newer http_parser.rb releases do not include a Java implementation.
gem "http_parser.rb", "~> 0.6.0", platforms: :jruby
