# Application Complexity Assessment

Compute an application migration complexity score for your applications that are monitored by New Relic.

## Open Source License

This project is distributed under the [Apache 2 license](./LICENSE).

## What do you need to make this work?

All of your applications instrumented using New Relic APM agents.

## Configuration

The default algorithm used to calculate an application's complexity score is:

Number of Software Dependencies + Number of Unique Transactions + Number of Programming Languages

No configuration is needed unless you wish to modify the algorithm.  In addition to the three metrics above, the additional metrics are also available as variables for complexity score computation (the text in parenthesis below is the name of the actual variable to be used in the configuration file):

 * Hardware Dependencies ("HW Dependencies")
 * External Software Dependencies ("SW External Dependencies")
 * Database Dependencies ("Database Dependencies")
 * Browser Application Dependencies ("Browser Dependencies")

The configuration file is named **algorithm.js** and is located in the **nerdlets/app-complexity-assessment-nerdlet** directory:

```
export var algorithm =
[
    {
      "fields": [
        {
          "SW Dependencies": {
            "type": "integer",
            "weight": 1
          },
          "Unique Transactions": {
            "type": "integer",
            "weight": 1
          },
          "Num Languages": {
            "type": "integer",
            "weight": 1
          }
        }
      ]
    }
]
```

Looking at the default configuration above, you can see that we are:

 * Calculating the complexity score based on three variables: "SW Dependencies", "Unique Transactions", and "Num Languages"
 * They are all weighted equally

Each variable's contribution to the overall complexity score is determined as **weight X value**. All variables are then added together.  For example, let's say we wish to modify the algorithm to:

 * Include the Browser Application dependency count for the application
 * Weight the number of software dependencies for the application twice as high as any other variable

That configuration file would look like the following:

```
export var algorithm =
[
    {
    	"fields": [{
    		"SW Dependencies": {
    			"type": "integer",
    			"weight": 2
    		},
    		"Unique Transactions": {
    			"type": "integer",
    			"weight": 1
    		},
    		"Num Languages": {
    			"type": "integer",
    			"weight": 1
    		},
    		"Browser Dependencies": {
    			"type": "integer",
    			"weight": 1
    		}
    	}]
    }
]
``` 

## Deploying this Application (Nerdpack)

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# this is to create a new uuid for the nerdpack so that you can deploy it to your account
nr1 nerdpack:uuid -g [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [New Relic One](https://one.newrelic.com/launcher/nr1-core.home?nerdpacks=local), navigate to the Nerdpack, and :sparkles:

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR SUPPORT, although you can report issues and contribute to the project here on GitHub.

_Please do not report issues with this software to New Relic Global Technical Support._
