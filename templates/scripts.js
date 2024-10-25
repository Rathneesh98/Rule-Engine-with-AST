 // Fetch rule names from the server and populate the dropdowns
fetch('/get_rule_names')
.then(response => response.json())
.then(data => {
    evaluateDropdown = document.getElementById('rule-name-evaluate');
    const combineDropdown = document.getElementById('rule-names-combine');

    data.forEach(ruleName => {
        const option = document.createElement('option');
        option.value = ruleName;
        option.textContent = ruleName;
        evaluateDropdown.appendChild(option);

        const optionClone = option.cloneNode(true);
        combineDropdown.appendChild(optionClone);
    });
});

// Handle adding a rule
document.getElementById('add-rule-form').addEventListener('submit', function(event) {
event.preventDefault();
const rule = document.getElementById('rule').value;

fetch('/add_rule', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rule: rule }),
})
.then(response => response.json())
.then(data => {
    displayResult(data);
    document.getElementById('add-rule-form').reset();
})
.catch(error => {
    console.error('Error:', error);
    displayResult({ error: 'An error occurred while adding the rule.' });
});
});

// Handle evaluating a rule
document.getElementById('evaluate-rule-form').addEventListener('submit', function(event) {
event.preventDefault();
const rule = document.getElementById('rule-to-evaluate').value;
const ruleName = document.getElementById('rule-name-evaluate').value;
const data = document.getElementById('data').value;

try {
        const jsonData = JSON.parse(data);
            fetch('/evaluate', {
                method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
    },
            body: JSON.stringify({ rule: rule, rule_name: ruleName, data: jsonData }),
    })
.then(response => response.json())
    .then(data => {
        displayResult(data);
            document.getElementById('evaluate-rule-form').reset();
})
    .catch(error => {
        console.error('Error:', error);
    displayResult({ error: 'An error occurred while evaluating the rule.' });
    });
} catch (e) {
    displayResult({ error: 'Invalid JSON data. Please correct and try again.' });
}
});

// Fetch the rule string when a rule is selected from the dropdown
document.getElementById('rule-name-evaluate').addEventListener('change', function() {
const selectedRuleName = this.value;
if (selectedRuleName) {
        fetch(`/get_rule_string?name=${encodeURIComponent(selectedRuleName)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('rule-to-evaluate').value = data.rule_string;
        })
        .catch(error => {
            console.error('Error:', error);
    });
} else {
document.getElementById('rule-to-evaluate').value = '';
}
});

// Handle combining multiple rules
document.getElementById('combine-rules-form').addEventListener('submit', function(event) {
event.preventDefault();
const rules = document.getElementById('rules').value.trim().split('\n');
const selectedRuleNames = Array.from(document.getElementById('rule-names-combine').selectedOptions).map(option => option.value);

fetch('/combine_rules', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rules: rules, rule_names: selectedRuleNames }),
})
.then(response => response.json())
.then(data => {
        displayResult(data);
            document.getElementById('combine-rules-form').reset();
})
.catch(error => {
        console.error('Error:', error);
        displayResult({ error: 'An error occurred while combining the rules.' });
});
});

// Function to display results
function displayResult(result) {
const resultDiv = document.getElementById('results');
resultDiv.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
}