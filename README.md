# StacksUp
Small command line utility used to verify which of the instances in our stacks are up and running as expected.

It reads a very basic config file containing an array of stack ids and then determines and prints out the state of the instances linked to these stacks.

Below is an example of the config:

```js
{
    "stack_ids": [
        "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    ]
}
```

Below is an example of how to run the command:

```
node index.js ./stacksup.json
```

or if linked correctly:

```
stacksup ./stacksup.json
```

Below is an example of the output to be expected:

![Example output from Stacksup](http://i.imgur.com/EkcVruP.png)
