
<?php
$pageTitle = 'index';
$pageStyle = 'style-index.css';
$pageScript = 'script-index.js'; ?>


<?php include('includes/header.php'); ?>

<div class = "wrapper">
    

  <form class="radio-form">
    <label><input type="radio" name="checked" value="first" checked> First Fit</label>
    <label><input type="radio" name="checked" value="best"> Best Fit</label>
    <label><input type="radio" name="checked" value="worst"> Worst Fit</label>
    <label><input type="radio" name="checked" value="next"> Next Fit</label>
  </form>
    <div>
        <div class = "randomRegister-Container"> </div>
    </div>
    <main class = "register-container"> </main>


</div>
<?php include 'includes/footer.php'; ?>



