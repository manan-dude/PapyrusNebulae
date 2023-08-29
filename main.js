// Import the required module
const express = require('express');
const bodyParser = require('body-parser'); 
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');


const fs = require('fs'); //File system module

// Create an instance of the Express application
const app = express();


// Set the port number for the server
const PORT = 3001;

// Set up our credentials object.
const credentials =  PDFServicesSdk.Credentials
        .servicePrincipalCredentialsBuilder()
        .withClientId("ClientIdAdobe")
        .withClientSecret("ClientSecretAdobe")
        .build();

const path = require('path');
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Handle GET request for the root route ('/')
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/success.html');
});

// Handle POST request for the '/resume' route
app.post('/resume',(req, res) => {

  // Destructure the properties from the request body
    const {
      Name,
      LastName,
      JobTitle,
      EmailAddress,
      PhoneNumber,
      LinkedIn,
      Summary,
      ContentBlock,
      template_id,
      Skills,
      Achievements,
      Education,
      Experience
    } = req.body;

  // Split the Skills string into an array of individual skills
    const skillsArray = String(Skills).split(',').map(skill => skill.trim());
    
  // Create a resumeData object to store the extracted and formatted data
    const resumeData = {
     
      Name,
      LastName,
      JobTitle,
      EmailAddress,
      PhoneNumber,
      LinkedIn,
      Summary,
      ContentBlock,
      template_id,
      Skills: skillsArray,
      Achievements,
      Education,
      Experience
      
    };


   
  // Code for Adobe Document API integration

  // Define the base name and extension for the output resume file
    const OUTPUT_BASE_NAME = 'generatedResume';
    const OUTPUT_EXTENSION = '.pdf';
  
  // Initialize a counter variable for generating unique output file names
    let counter = 1;
  
  // Generate the initial output file name using the base name, counter, and extension
    let OUTPUT = `${OUTPUT_BASE_NAME}${counter}${OUTPUT_EXTENSION}`;
  
  // Specify the input file path based on the template_id
    const INPUT = `./ResumeTemplates/resume${template_id}.docx`;


// Function to generate a unique output filename
const generateUniqueOutputName = () => {
  while (fs.existsSync(OUTPUT)) {
    counter++;
    OUTPUT = `${OUTPUT_BASE_NAME}${counter}${OUTPUT_EXTENSION}`;
  }
};

// If our output already exists, generate a unique filename
if (fs.existsSync(OUTPUT)) {
  generateUniqueOutputName();
}


 // Convert resume object to JSON
 const jsonData = JSON.stringify(resumeData, null, 2);

 // Write JSON data to file
 fs.writeFile(`./ResumeJSON/resume_${counter}.json`, jsonData, (err) => {
   if (err) {
     console.error('Error writing JSON file:', err);
     res.status(500).send('Error creating JSON file.');
     return;
   }

  // Define the path to the JSON input file based on the counter
const JSON_INPUT = require(`./ResumeJSON/resume_${counter}.json`);

// Create an execution context using the provided credentials
const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

// Import the required classes for document merging
const documentMerge = PDFServicesSdk.DocumentMerge;
const documentMergeOptions = documentMerge.options;

// Create document merge options with the JSON input and desired output format (PDF)
const options = new documentMergeOptions.DocumentMergeOptions(JSON_INPUT, documentMergeOptions.OutputFormat.PDF);

// Create a new document merge operation with the specified options
const documentMergeOperation = documentMerge.Operation.createNew(options);

// Create a PDFServicesSdk.FileRef object from the local input file path
const input = PDFServicesSdk.FileRef.createFromLocalFile(INPUT);

// Set the input file for the document merge operation
documentMergeOperation.setInput(input);

// Execute the document merge operation using the provided execution context
documentMergeOperation.execute(executionContext)
  .then(result => result.saveAsFile(OUTPUT)) // Save the merged document as a file with the specified output path
  .then(() => {
    res.status(200).json({ message: 'Resume generated successfully.' });// Send a success response if the document merge and saving are successful

  })
  .catch(err => {
    console.error('Exception encountered while executing operation:', err);
    res.status(500).send('Internal Server Error.');// Send an error response if there is an exception
  });


      
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Resume Generator: http://localhost:${PORT}`);
  
});
