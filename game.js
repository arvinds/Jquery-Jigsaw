$(document).ready(function(){	
	// this is the number of matches the user needs to get on the board to win.
	// there are 25 pieces/slots for each puzzle hence the number is set to 25.
	const NUM_TO_WIN = 25; 
	
	// the "preview" and "winner" divs are hidden at the beginning of the game
	$(".preview").hide();
	$(".winner").hide();
	
	// this function loads the pieces for the puzzle specified by the parameter imgType
	// onto the screen randomly. it generates numbers randomly between 25 and stores them in an array in order to ensure 
	// the numbers genrated are unique.
	function loadImages(imgType){
		var rand = [];			// this array holds the 25 ids before they are randomized
	        for(i = 1; i < 26; i++){
	        	rand.push(i);
	        }
	        
		 // this algorithm for randomizing the array was taken from the article "Extending JavaScript Arrays" @ http://www.go4expert.com/forums/showthread.php?t=606
        var tmp, num1, i = rand.length;
		while(i--)
		{
		         num1=Math.floor((i+1)*Math.random());
		         tmp=rand[i];
		         rand[i]=rand[num1];
		         rand[num1]=tmp;
        }
        jQuery.each(rand,function(){	// the images are created and added to the pieces div
                img = "images/" + imgType +"/" + imgType + "_" + this +".gif"; // the image path is set
                pic = new Image();					
                $(pic).addClass("piece");		
                $(pic).attr({id:this});
                $(pic).attr({value:imgType});
                pic.src = img;
                $(".pieces").append(pic);               
		});
    };
    	
    	//sets the images in the pieces div as draggable objects
    function setPiecesDraggable(){
        $(".piece").draggable({
                cursor: "url(images/grab.cur), auto", //the cursor is a tarnsparent so it looks like piece becomes the cursor
                containment: $("."),
                opacity: 0.4,
                scroll: false,
                snap: $(".drop"),
                snapMode: "inner"
        });
    };
		
    	
	// this controls what happens when the user selects a jigsaw puzzle by clicking on it
	$(".imgs").click(function (){
		// the preview and winner divs are emptied and hidden
		$(".preview").empty();
		$(".preview").hide();
		$(".winner").empty();
		$(".winner").hide();

		// calls for the pieces to be loaded and then sets them as draggables
		var picID = $(this).attr("id");
		var turl = "index.html";
		$(".instructions").empty();
		$(".instructions").append("Drag the puzzle pieces onto the board. Move your cursor over the menu thumbnail to see what the finished image is supposed to look like.");
		$(".pieces").empty();
		loadImages(picID);
		setPiecesDraggable();
	});
	// controls what happens when the user hovers over the menu pic(a preview of the image is shown)
	$(".imgs").hover(function(){;
		$(".winner").empty();
		$(".winner").hide();
		$(".preview").show();
		var picID = $(this).attr("id");
		var img = new Image();
		img.src = "images/"+picID+"/"+picID+".jpg";
		$(img).attr({width:604}); // this is being set manually because the css seems to fail on some browsers
		$(img).attr({height:403}); // this is being set manually because the css seems to fail on some browsers
		$(".preview").append(img);
		},function(){				// this function controls what happens when the user moves the cursor off the image
			$(".preview").empty();
			$(".preview").hide();
	});
		
	// this funciton sets up the droppables in the main table
	$(".drop").droppable({
	// a droppable will truly "accept" only the one piece that belongs there but the "snap" feature of 
	//the draggables gives the user the illusion that all the pieces can fit everywhere
		accept: function(draggable){		
			var droppableId = $(this).attr("id");
			var imageId = $(draggable).attr("id");
			return (droppableId == imageId);  // compares ids of the piece and the and droppable
		},
		out:function(draggable){	//if the user moves the piece out of the draggable, the class "correct" is removed if it has been added to the draggable
			$(this).removeClass("correct");	
		},
		tolerance: 'intersect',
		activeClass: 'droppable-active',
		hoverClass: 'droppable-hover',
		drop: function(ev,ui){		// controls what happens when an "acceptable" piece is put on the draggable
			$(this).addClass("correct");	// the "correct" class is added to this draggable
			var numberCorrect = $(".correct").size();	// the total number of correct pieces is calculated
			if(numberCorrect == NUM_TO_WIN){		// if the total number is 25(meaning all 25 pieces are in the right place)
				$(".instructions").empty();	
				$(".pieces").empty();
				$(".instructions").append("<b>Congratulations! YOU GOT IT! Now try another puzzle!</b>");
				var imgType =$(ui.draggable).attr("value");
				var imgSrc = "images/" + imgType +"/" + imgType + ".jpg";
				var img = new Image();
				img.src = imgSrc;
				$(img).attr({width:604});
				$(img).attr({height:403});
				$(".winner").append(img);
				$(".winner").show();
				$(".correct").removeClass("correct");	// the draggables are reset
			}
		}
	});
});
