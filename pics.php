<?php 
include 'ChromePhp.php';

//ChromePhp::log('Hello console!');

// TODO 
// Rotate image based on Exif data

set_time_limit(40);

// Where to find pictures to show?
$dir='bilder';
//$dir='/media/usbdata/bilder';
//echo $dir;

/*
if(is_dir($dir)){
	echo "ok\n";
  	foreach(scandir($dir) as $file){
    		$ext = pathinfo($file, PATHINFO_EXTENSION);
		echo "ext: " .$ext;
	}
}
*/
/*
$images = scandir($dir);
        foreach ($images as $file) {
        	$files[$file] = filemtime($dir . '/' . $file);
		//echo $file;
    	}
*/
try {
	// All file names in an array
	$allimages = preg_grep('~\.(jpeg|jpg|png|PNG|JPEG|JPG)$~', scandir($dir));
	$images = array_filter($allimages);	// Remove empty posts

	// Sort by modification time
        foreach ($images as $file) {
        	$files[$file] = filemtime($dir . '/' . $file);
    	}
    	arsort($files);
    	$files = array_keys($files);

	//print_r ($files);
	$nooffiles = count($files);

	// Get a weighted random number (favor most recent pictures)
        $filenr = weightedrand(2, $nooffiles, 1.5);	// https://stackoverflow.com/questions/445235/generating-random-results-by-weight-in-php
	$filename = $files[$filenr];

/*
	//print_r($nooffiles." files in ".$dir."<br>");
	// Get a random file
	// index 0 and 1 are . and .., dont select these
	// Set max random number to no of files in array
	$rand = rand(2 , $nooffiles);
	$filename = $files[$rand];
	ChromePhp::log("Filename: " . $filename);

	$ext = pathinfo($filename, PATHINFO_EXTENSION);
	while ($ext!="jpg") {
		$rand = rand(2 , $nooffiles);
		$filename = $files[$rand];
		$ext = pathinfo($filename, PATHINFO_EXTENSION);
	}
*/
	$path_filename = $dir."/".$filename;
	//echo "Number: " . $filenr .". Whole path: ".$path_filename."<br>";
	ChromePhp::log('Path: ' . $path_filename);
	//ChromePhp::log('Php - Get exif data');

	// Get exif data
	$exif = exif_read_data($path_filename, 0, true);
	// Extract exif data
	$exifdatetime=$exif['EXIF']['DateTimeOriginal'];
	$pieces = explode(" ", $exifdatetime);
	$exifdate = $pieces[0];
	$exifdate = str_replace(':', '-', $exifdate);
	$exiftime = $pieces[1];

	$exifheight=$exif['COMPUTED']['Height'];
	$exifwidth=$exif['COMPUTED']['Width'];
	$ratio=$exifheight/$exifwidth;
	$rotation = $exif['IFD0']['Orientation'];
	//echo $rotation;
	ChromePhp::log('Get rotation');

	// Find image rotation
	    if (!empty($exif['Orientation'])) {
	    //print_r $exif['Orientation'];
		switch ($exif['Orientation']) {
		    case 3:
			//echo "3";
			break;
		    case 6:
			// -90 degrees
			break;
		    case 8:
			// 90 degrees
			break;
		}
	    }


	// Show all values
	/*
	foreach ($exif as $key => $section) {
	    foreach ($section as $name => $val) {
		//echo "$key.$name: $val<br />\n";
		echo("<script>console.log('PHP: $key.$name: $val');</script>");
	    }
	}
	*/
	ChromePhp::log('Create array');

	$filedata = array(
		'path' => $dir,
		'filename' => $filename,
		'date' => $exifdate,
		'time' => $exiftime,
		'height' => $exifheight,
		'width' => $exifwidth,
		'ratio' => $ratio,
		'rotation' => $rotation, 
	     );
	//ChromePhp::log('Collected data to return: ' . $filedata[0]);

	echo json_encode($filedata);
} catch (Exception $e) {
	//ChromePhp::log('pics.php error);
	echo json_encode("{'error':'pics.php error'}");	
}

function weightedrand($min, $max, $gamma) {
    $offset= $max-$min+1;
    return floor($min+pow(lcg_value(), $gamma)*$offset);
}
?>
