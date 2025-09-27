using System;
using System.Collections;
using System.Data;
using System.Text;
using System.Transactions;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using IptradeNet.Core.Common;
using IptradeNet.Core.Component;
using IptradeNet.Core.TFTP;
using IptradeNet.Core.Security;
using IptradeNet.Foundations.Base;
using IptradeNet.Foundations.Log;
using IptradeNet.Foundations.DBAccess;
using IptradeNet.Console;
using System.Collections.Generic;
using System.Linq;

public partial class UCProfileBasicSettings : UCBasicSettings
{
    //--- Properties ---

    #region --- Category ---
    public Helper.SettingCategory Category
    {
        get
        {
            if (ViewState["ProfileBasicSetting_Category"] != null)
                return (Helper.SettingCategory)ViewState["ProfileBasicSetting_Category"];
            else
                return Helper.SettingCategory.TerminalProfile;
        }
        set { ViewState["ProfileBasicSetting_Category"] = value; }
    }

    public Helper.SettingCategory MergedTerminalsCategory
    {
        get
        {
            switch(Category)
            {
                case Helper.SettingCategory.NetrixBoot:
                    return Helper.SettingCategory.TerminalBoot;
                case Helper.SettingCategory.NetrixProfile:
                    return Helper.SettingCategory.TerminalProfile;
                default:
                    return Category;
            }
            
        }
    }

    #endregion

    #region --- currentCategoryName ---
    protected override string currentCategoryName
    {
        get
        {
            switch (Category)
            {
                case Helper.SettingCategory.TerminalBoot:
                case Helper.SettingCategory.TPOBoot:
                case Helper.SettingCategory.NetrixBoot:
                    return "boot";

                case Helper.SettingCategory.TerminalProfile:
                case Helper.SettingCategory.NetrixProfile:
                    return "profile";

                case Helper.SettingCategory.TPOPrivate:
                    return "private";

                case Helper.SettingCategory.TPOShared:
                    return "shared";
            }

            return string.Empty;
        }
    }
    #endregion

    #region --- xmlFilename ---
    protected override string xmlFilename
    {
        get
        {
            switch (Category)
            {
                case Helper.SettingCategory.NetrixBoot:
                case Helper.SettingCategory.NetrixProfile:
                    return "SettingsNetrix.xml";
                case Helper.SettingCategory.TerminalBoot:
                case Helper.SettingCategory.TerminalProfile:
                    return "SettingsTerminal.xml";

                default :
                    return "SettingsTPO.xml";
            }
        }
    }
    #endregion

    #region --- DBStore ---
    protected DBStore DBStore
    {
        get
        {
            if (ViewState["UCProfileBasicSettings"] == null)
                ViewState["UCProfileBasicSettings"] = new DBStore();

            return (DBStore)ViewState["UCProfileBasicSettings"];
        }
        set { ViewState["UCProfileBasicSettings"] = value; }
    }
    #endregion

    #region --- ProfileUId ---
    public string ProfileUId
    {
        get
        {
            if (ViewState["ProfileBasicSetting_ProfileUId"] != null)
                return ViewState["ProfileBasicSetting_ProfileUId"].ToString();
            else
                return string.Empty;
        }
        set { ViewState["ProfileBasicSetting_ProfileUId"] = value; }
    }
    #endregion

    #region --- SharedProfile ---
    public bool SharedProfile
    {
        get
        {
            if (ViewState["ProfileBasicSetting_SharedProfile"] != null)
                return bool.Parse(ViewState["ProfileBasicSetting_SharedProfile"].ToString());
            else
                return true;
        }
        set { ViewState["ProfileBasicSetting_SharedProfile"] = value; }
    }
    #endregion

    #region --- DisplayInherited ---
    public bool DisplayInherited
    {
        get
        {
            if (ViewState["ProfileBasicSetting_DisplayInherited"] != null)
                return bool.Parse(ViewState["ProfileBasicSetting_DisplayInherited"].ToString());
            else
                return false;
        }
        set { ViewState["ProfileBasicSetting_DisplayInherited"] = value; }
    }
    #endregion

    #region --- ReconstructGlobalCfgFile ---
    public bool ReconstructGlobalCfgFile
    {
        get
        {
            if (ViewState["ProfileBasicSetting_ReconstructGlobalCfgFile"] != null)
                return bool.Parse(ViewState["ProfileBasicSetting_ReconstructGlobalCfgFile"].ToString());
            else
                return false;
        }
        set { ViewState["ProfileBasicSetting_ReconstructGlobalCfgFile"] = value; }
    }
    #endregion

    #region --- InsetAllowed ---
    public bool? InsetAllowed
    { 
        get 
        {
            return (bool?)ViewState[ClientID + "_InsetAllowed"];
        }
        set 
        {
            ViewState[ClientID + "_InsetAllowed"] = value;
        }
    }
    #endregion

    #region --- Applications ---
    private Dictionary<string, AppApplication> applications;
    protected Dictionary<string, AppApplication> Applications
    {
        get
        {
            if (applications == null)
                applications = new Dictionary<string, AppApplication>();
            return applications;
        }
    }

    #endregion

    #region --- SharedProfiles ---
    public UsrProfileCollection SharedProfiles
    {
        get { return DBStore.UsrProfileCollection; }
        set { DBStore.UsrProfileCollection = value; }
    }
    #endregion

    //--- Event Methods ---

    #region --- Page_Load ---
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Visible == false)
            return;

        lUpdateStatus.Visible = false;

        if (!IsPostBack)
            GetDataFromDatabase();

        string groupName = Request.QueryString["groupName"];
        if (!string.IsNullOrEmpty(groupName))
            SelectedGroup = groupName;

        if (!IsPostBack)
        {
            UpdateComponentsVisibility();
        }

        if (!Page.ClientScript.IsClientScriptIncludeRegistered("JQuery-3.6"))
            Page.ClientScript.RegisterClientScriptInclude("JQuery", "javascript/jquery-3.6.0.min.js");

        ConstructGroups(this.Visible, plhGroups);
    }
    #endregion

    #region --- linkButton_Click ---
    /// <summary>
    /// Menu click: Choose group
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected override void linkButton_Click(object sender, EventArgs e)
    {
        UpdateData(string.Empty);

        SelectedGroup = ((UCButtonImage)sender).Attributes["name"];

        ConstructGroups(true, plhGroups);
    }
    #endregion

    #region --- Button: Save ---
    /// <summary>
    /// Save current group of settings
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected override void bSave_Click(object sender, EventArgs e)
    {
        using (TransactionScope scope = new TransactionScope())
        {
            UpdateData(string.Empty);

            UsrProfile.UpdateVersionAndLastUpdateDatetimeByProfileUId(DBLocation, ProfileUId);

            DBStore.UsrSettingCollection.Update(DBLocation: DBLocation, openTransact: false);

            scope.Complete();
        }

        // refresh
        GetDataFromDatabase();
        ConstructSettings();

        lUpdateStatus.Visible = true;

        if (currentCategoryName.Equals("boot"))
        {
            TFTPHelperBootSettings.GenerateProfileFiles(ProfileUId, Application);
            CoreHelper.OnBootSettingEdited(DBLocation);
        }

        if (ReconstructGlobalCfgFile)
            TFTPHelper.ReconstructGlobalTurretCfgFile(DBLocation);
    }
    #endregion

    #region --- Button: Refresh ---
    /// <summary>
    /// Reload settings
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void b_refresh_Click(object sender, EventArgs e)
    {
        GetDataFromDatabase();
        ConstructSettings();
    }
    #endregion


    //--- Personal Methods ---

    #region --- GetDataFromDatabase ---
    /// <summary>
    /// Retrieve all settings of profile from database
    /// </summary>
    public override void GetDataFromDatabase()
    {
        DBStore.UsrSettingCollection.Clear();
        DBStore.UsrSettingCollection.Add(UsrSetting.GetByProfileUIdAndCategory(DBLocation, ProfileUId, MergedTerminalsCategory));

        // Get inheritance objects (turret)
        if (MergedTerminalsCategory == Helper.SettingCategory.TerminalBoot)
        {
            DBStore.AppModelCollection.Clear();
            DBStore.AppModelCollection.Add(AppModel.GetByProfileUId(DBLocation, ProfileUId));

            DBStore.AcsZoneCollection.Clear();
            DBStore.AcsZoneCollection.Add(AcsZone.GetByProfileUId(DBLocation, ProfileUId));
            DBStore.AcsZoneCollection.Add (AcsZone.GetByNameInsensitive(DBLocation, "System"));
        }

        // Get inheritance objects (tpo)
        if (Category == Helper.SettingCategory.TPOBoot)
        {
            DBStore.UsrTpoClusterNodeCollection.Clear();
            DBStore.UsrTpoClusterNodeCollection.Add (UsrTpoClusterNode.GetByNodeProfileUId(DBLocation, ProfileUId));

            DBStore.AcsZoneCollection.Clear();
            DBStore.AcsZoneCollection.Add (AcsZone.GetByProfileUId(DBLocation, ProfileUId));
            DBStore.AcsZoneCollection.Add (AcsZone.GetByNameInsensitive(DBLocation, "System"));
        }

        // settings for turret users
        if (MergedTerminalsCategory == Helper.SettingCategory.TerminalProfile &&
            !SharedProfile && DisplayInherited)
        {
            // get all shared profiles
            SharedProfiles = UsrProfile.GetSharedByProfileUId(DBLocation, ProfileUId);
        }
    }
    #endregion

    #region --- ConstructSettings ---
    protected override void ConstructSettings()
    {
        plhSettings.Controls.Clear();

        Table tableSetting = new Table();
        tableSetting.ID = "tableSetting";
        tableSetting.EnableViewState = false;
        tableSetting.CellPadding = 10;
        tableSetting.CellSpacing = 0;
        tableSetting.Width = Unit.Pixel(1060);
        plhSettings.Controls.Add(tableSetting);
        tableSetting.ID = "tableSetting";

        foreach (XmlNode nodeCategory in xmlDoc.SelectNodes("categories/category"))
        {
            string categoryName = XmlUtils.GetAttributeValue(nodeCategory, "name");

            if (categoryName == currentCategoryName)
            {
                foreach (XmlNode nodeGroup in nodeCategory.SelectNodes("groups/group"))
                {
                    string groupName = XmlUtils.GetAttributeValue(nodeGroup, "name");
                    if (canAddGroup(groupName))
                    {
                        if (groupName == SelectedGroup)
                        {
                            int i = 0;

                            #region -- Header --

                            TableRow rowHeaderSetting = new TableRow();
                            rowHeaderSetting.CssClass = "tableHead";
                            tableSetting.Rows.Add(rowHeaderSetting);

                            TableCell cellHeaderName = new TableCell();
                            cellHeaderName.Width = Unit.Pixel(250);
                            cellHeaderName.Text = "Name";
                            rowHeaderSetting.Cells.Add(cellHeaderName);

                            TableCell cellHeaderValue = new TableCell();
                            cellHeaderValue.Text = "Value";
                            cellHeaderValue.Width = Unit.Pixel(430);
                            rowHeaderSetting.Cells.Add(cellHeaderValue);

                            if (!SharedProfile && DisplayInherited)
                            {
                                TableCell cellHeaderHeritage = new TableCell();
                                cellHeaderHeritage.Width = Unit.Pixel(140);
                                cellHeaderHeritage.Text = "Inherited Value";
                                rowHeaderSetting.Cells.Add(cellHeaderHeritage);
                            }

                            TableCell cellHeaderDescription = new TableCell();
                            cellHeaderDescription.Width = Unit.Pixel(20);
                            cellHeaderDescription.HorizontalAlign = HorizontalAlign.Right;
                            cellHeaderDescription.Text = "Description";
                            rowHeaderSetting.Cells.Add(cellHeaderDescription);

                            #endregion

                            #region -- Content --
                            foreach (XmlNode nodeSetting in nodeGroup.SelectNodes(string.Format("settings/setting[@basic_level='{0}']", BasicLevel ? "Y" : "N")))
                            {
                                string friendlyName = XmlUtils.GetAttributeValue(nodeSetting, "friendly_name");
                                string settingKey = XmlUtils.GetAttributeValue(nodeSetting, "name");
                                string settingKeyId = settingKey.Replace(" ", "_").Replace(".", "_");
                                string settingName = "setting_" + settingKeyId;
                                string settingType = XmlUtils.GetAttributeValue(nodeSetting, "type");
                                string settingDefaultValue = XmlUtils.GetAttributeValue(nodeSetting, "default_value");
                                string settingDefaultValueCoded = XmlUtils.GetAttributeValue(nodeSetting, "default_value_code");
                                string settingValidatorRequire = XmlUtils.GetAttributeValue(nodeSetting, "validator_require");
                                string settingValidatorRange = XmlUtils.GetAttributeValue(nodeSetting, "validator_range");
                                string settingValidatorRegex = XmlUtils.GetAttributeValue(nodeSetting, "validator_regex");
                                string settingShortDescription = XmlUtils.GetAttributeValue(nodeSetting, "short_description").Replace("\"", "'");
                                string settingLongDescription = XmlUtils.GetAttributeValue(nodeSetting, "long_description");
                                string settingConstraintDescription = XmlUtils.GetAttributeValue(nodeSetting, "contraint_description");
                                bool settingMandatory = (XmlUtils.GetAttributeValue(nodeSetting, "mandatory") == "Y") ? true : false;

                                // Get Related settings to this setting
                                StringBuilder settingsSettingsDescription = new StringBuilder();
                                foreach (XmlNode nodeSettingsSetting in nodeSetting.SelectNodes("settingsSettings/settingsSetting"))
                                {
                                    // Search setting with same name as nodeSettingsSetting in current loaded xmlDocument
                                    buildRelatedStgDesc(nodeSettingsSetting, settingsSettingsDescription, xmlDoc, groupName);
                                }

                                UsrSetting tmpS = GetBySettingKey(settingKey);
                                bool settingAvailable = (tmpS != null) ? true : false;

                                TableRow rowSetting = new TableRow();
                                rowSetting.ID = "tr_" + settingKeyId;
                                rowSetting.CssClass = (i % 2 == 0) ? "tableLineFirst" : "tableLineLast";
                                rowSetting.CssClass += " forceNormalWordBreak";
                                tableSetting.Rows.Add(rowSetting);

                                // checkbox available
                                TableCell cellName = new TableCell();
                                cellName.ID = "td_" + settingKeyId;
                                rowSetting.Cells.Add(cellName);
                                CheckBox chSettingAvailable = new CheckBox();
                                chSettingAvailable.ID = "cb_" + settingKeyId;
                                chSettingAvailable.Text = friendlyName;
                                chSettingAvailable.AutoPostBack = false;
                                chSettingAvailable.Checked = settingAvailable;
                                chSettingAvailable.Enabled = true;
                                chSettingAvailable.Width = Unit.Pixel(370);
                                chSettingAvailable.Attributes.Add("SettingID", nodeSetting.Attributes["id"].Value);
                                chSettingAvailable.CssClass = "cbSetting";
                                cellName.Controls.Add(chSettingAvailable);

                                // controls value
                                TableCell cellControlValue = new TableCell();
                                cellControlValue.Attributes.Add("name", "cellControl_" + settingName);
                                rowSetting.Cells.Add(cellControlValue);
                                cellControlValue.EnableViewState = false;
                                WebControl settingControl = null;

                                switch (settingType)
                                {
                                    case "tb":
                                        TextBox tbValue = new TextBox();
                                        tbValue.ID = settingName;
                                        tbValue.Width = Unit.Pixel(410);
                                        tbValue.Text = (settingAvailable) ? tmpS.KeyValue : settingDefaultValueCoded;
                                        tbValue.Enabled = settingAvailable;
                                        cellControlValue.Controls.Add(tbValue);
                                        settingControl = tbValue;
                                        break;

                                    case "pw":
                                        TextBox tbPwdValue = new TextBox();
                                        tbPwdValue.ID = settingName;
                                        tbPwdValue.TextMode = TextBoxMode.Password;
                                        tbPwdValue.Width = Unit.Pixel(410);
                                        tbPwdValue.Attributes.Add("value", (settingAvailable) ? tmpS.KeyValue : settingDefaultValueCoded);
                                        tbPwdValue.Enabled = settingAvailable;
                                        cellControlValue.Controls.Add(tbPwdValue);
                                        settingControl = tbPwdValue;
                                        break;

                                    case "rb":
                                        RadioButtonList rbValue = new RadioButtonList();
                                        rbValue.ID = settingName;
                                        rbValue.RepeatDirection = RepeatDirection.Horizontal;
                                        if (settingAvailable)
                                            rbValue.Items.AddRange(GetListItem(nodeSetting, tmpS.KeyValue));
                                        else
                                            rbValue.Items.AddRange(GetListItem(nodeSetting, settingDefaultValueCoded));
                                        rbValue.Enabled = settingAvailable;
                                        cellControlValue.Controls.Add(rbValue);
                                        settingControl = rbValue;
                                        break;

                                    case "bl":
                                        RadioButtonList booleanValue = new RadioButtonList();
                                        booleanValue.ID = settingName;
                                        booleanValue.RepeatDirection = RepeatDirection.Horizontal;
                                        booleanValue.Items.AddRange(new ListItem[] { new ListItem("true"), new ListItem("false") });
                                        if (settingAvailable)
                                            booleanValue.SelectedValue = tmpS.KeyValue.ToLower();
                                        else
                                            booleanValue.SelectedValue = settingDefaultValueCoded.ToLower();
                                        booleanValue.Enabled = settingAvailable;
                                        cellControlValue.Controls.Add(booleanValue);
                                        settingControl = booleanValue;
                                        break;

                                    case "dd":
                                        DropDownList ddValue = new DropDownList();
                                        ddValue.ID = settingName;
                                        if (settingAvailable)
                                            ddValue.Items.AddRange(GetListItem(nodeSetting, tmpS.KeyValue));
                                        else
                                            ddValue.Items.AddRange(GetListItem(nodeSetting, settingDefaultValueCoded));
                                        ddValue.Enabled = settingAvailable;
                                        cellControlValue.Controls.Add(ddValue);
                                        settingControl = ddValue;
                                        break;
                                }

                                if(settingControl != null)
                                {
                                    settingControl.Attributes.Add("data-defaultvalue", settingType != "bl" ? settingDefaultValueCoded : settingDefaultValueCoded.ToLower());
                                    if (settingType != "bl")
                                        settingControl.Attributes.Add("data-defaultvalueonenabled", settingDefaultValue);
                                    else
                                    {
                                        bool defaultValue = true;
                                        bool.TryParse(settingDefaultValueCoded, out defaultValue);

                                        settingControl.Attributes.Add("data-defaultvalueonenabled", (!defaultValue).ToString().ToLower());
                                    }
                                    settingControl.Attributes.Add("data-settingtype", settingType);
                                    settingControl.CssClass = "settingControl_" + nodeSetting.Attributes["id"].Value;
                                }

                                // Validators

                                if (settingValidatorRequire == "y" && chSettingAvailable.Checked)
                                {
                                    RequiredFieldValidator rfvValue = new RequiredFieldValidator();
                                    rfvValue.ErrorMessage = "This field cannot be empty!<br />";
                                    rfvValue.ControlToValidate = settingName;
                                    rfvValue.ForeColor = System.Drawing.Color.Red;
                                    rfvValue.Display = ValidatorDisplay.Dynamic;
                                    rfvValue.CssClass = "validator_" + nodeSetting.Attributes["id"].Value;
                                    cellControlValue.Controls.Add(rfvValue);
                                }

                                if (!string.IsNullOrEmpty(settingValidatorRange))
                                {
                                    string[] minmax = settingValidatorRange.Split(';');

                                    if (minmax.Length > 2 && !string.IsNullOrEmpty(minmax[0]) && !string.IsNullOrEmpty(minmax[1]))
                                    { 
                                        RangeValidator rvValue = new RangeValidator();
                                        rvValue.ErrorMessage = string.Format("Value must be lie between {0} and {1}!<br />", minmax[0], minmax[1]);
                                        rvValue.ControlToValidate = settingName;
                                        rvValue.MinimumValue = minmax[0];
                                        rvValue.MaximumValue = minmax[1];
                                        rvValue.ForeColor = System.Drawing.Color.Red;
                                        rvValue.Type = CoreHelper.GetValidatorRangeFieldType(int.Parse(minmax[2]));
                                        rvValue.Display = ValidatorDisplay.Dynamic;
                                        rvValue.CssClass = "validator_" + nodeSetting.Attributes["id"].Value;
                                        cellControlValue.Controls.Add(rvValue);                                    
                                    }
                                }

                                if (!string.IsNullOrEmpty(settingValidatorRegex))
                                {
                                    RegularExpressionValidator revValue = new RegularExpressionValidator();
                                    revValue.ErrorMessage = "Format is incorrect!<br />";
                                    revValue.ValidationExpression = settingValidatorRegex;
                                    revValue.ControlToValidate = settingName;
                                    revValue.ForeColor = System.Drawing.Color.Red;
                                    revValue.Display = ValidatorDisplay.Dynamic;
                                    revValue.CssClass = "validator_" + nodeSetting.Attributes["id"].Value;
                                    cellControlValue.Controls.Add(revValue);
                                }

                                if (!SharedProfile && DisplayInherited)
                                {
                                    TableCell cellShared = new TableCell();
                                    cellShared.Style.Add("word-break", "break-all");
                                    cellShared.Text = GetHeritageText(settingKey, settingAvailable, "div_" + chSettingAvailable.ClientID);
                                    rowSetting.Cells.Add(cellShared);
                                }

                                // image description
                                TableCell cellDescription = new TableCell();
                                cellDescription.HorizontalAlign = HorizontalAlign.Right;
                                rowSetting.Cells.Add(cellDescription);

                                ConstructDescriptionRow(tableSetting, settingKey, 4, settingKeyId, settingShortDescription, settingLongDescription, settingConstraintDescription, settingMandatory, settingsSettingsDescription, cellDescription);

                                i++;
                            }
                            #endregion

                            #region -- Footer --

                            TableRow rowFooterSetting = new TableRow();
                            tableSetting.Rows.Add(rowFooterSetting);

                            TableCell cellFooter = new TableCell();
                            cellFooter.ColumnSpan = 4;
                            cellFooter.Text = "<img src=\"img/transparent.gif\" width=\"1\" height=\"30\" alt=\"\" />";
                            cellFooter.CssClass = "tableBottom";
                            rowFooterSetting.Cells.Add(cellFooter);

                            #endregion
                        }
                    }
                }
            }
        }
    }
    #endregion

    #region --- canAddGroup ---
    protected override bool canAddGroup(string groupName)
    {
        bool canAddGroup = true;

        if (Category == Helper.SettingCategory.TPOBoot || Category == Helper.SettingCategory.TPOPrivate || Category == Helper.SettingCategory.TPOShared)
        {
            if (SharedProfile && groupName.ToUpper() == "TPO")
                canAddGroup = false;
            else canAddGroup = true;
        }

        return canAddGroup;
    }
    #endregion

    #region --- GetHeritageText ---
    private string GetHeritageText(string keyName, bool keyRedefined, string divId)
    {
        string returnText = string.Empty;               

        int i = 0;

        // tpo cluster node
        if (DBStore.UsrTpoClusterNodeCollection.Count > 0 && DBStore.UsrTpoClusterNodeCollection[0].isLoadedFromDatabase && i == 0)
        {
            UsrTpoClusterNode usrTpoClusterNode = DBStore.UsrTpoClusterNodeCollection[0];
            UsrSetting usrSetting = UsrSetting.GetByProfileUIdKeyNameAndCategory(DBLocation, usrTpoClusterNode.ClusterProfileUId, keyName, (Category == Helper.SettingCategory.TPOBoot) ? Helper.SettingCategory.TPOBoot : Helper.SettingCategory.TPOShared);
            if (usrSetting.isLoadedFromDatabase)
            {
                UsrProfile usrProfile = UsrProfile.GetByUId(DBLocation, usrTpoClusterNode.ClusterProfileUId);
                returnText += string.Format("<a href=\"GeneralEditionForm.aspx?action=edit&type={3}&item={0}\">{1}</a>: {2} <br />", usrTpoClusterNode.ClusterProfileUId, usrProfile.Name, usrSetting.KeyValue, "tpoprofile");
                i++;
            }
        }

        // specific zone
        if (DBStore.AcsZoneCollection.Count > 0 && DBStore.AcsZoneCollection[0].isLoadedFromDatabase && i == 0)
        {
            AcsZone acsZoneSpecific = DBStore.AcsZoneCollection[0];
            UsrSetting usrSetting = UsrSetting.GetByProfileUIdKeyNameAndCategory(DBLocation, acsZoneSpecific.ProfileUId, keyName, MergedTerminalsCategory);
            if (usrSetting.isLoadedFromDatabase)
            {
                returnText += string.Format("<a href=\"ZoneEditionForm.aspx?action=edit&item={0}\">{1}</a>: {2} <br />", acsZoneSpecific.UId, acsZoneSpecific.Name.Trim(), usrSetting.KeyValue);
                i++;
            }
        }

        // model
        if (DBStore.AppModelCollection.Count > 0 && DBStore.AppModelCollection[0].isLoadedFromDatabase && i == 0)
        {
            AppModel appModel = DBStore.AppModelCollection[0];
            UsrSetting usrSetting = UsrSetting.GetByProfileUIdKeyNameAndCategory(DBLocation, appModel.ProfileUId, keyName, MergedTerminalsCategory);
            if (usrSetting.isLoadedFromDatabase)
            {
                returnText += string.Format("<a href=\"ModelEditionForm.aspx?action=edit&item={0}\">{1}</a>: {2} <br />", appModel.ID, appModel.ExternalName, usrSetting.KeyValue);
                i++;
            }
        }

        // system zone
        if (DBStore.AcsZoneCollection.Count > 1 && DBStore.AcsZoneCollection[1].isLoadedFromDatabase && i == 0)
        {
            AcsZone acsZoneSystem = DBStore.AcsZoneCollection[1];
            UsrSetting usrSetting = UsrSetting.GetByProfileUIdKeyNameAndCategory(DBLocation, acsZoneSystem.ProfileUId, keyName, MergedTerminalsCategory);
            if (usrSetting.isLoadedFromDatabase)
            {
                returnText += string.Format("<a href=\"ZoneEditionForm.aspx?action=edit&item={0}\">{1}</a>: {2} <br />", acsZoneSystem.UId, acsZoneSystem.Name.Trim(), usrSetting.KeyValue);
                i++;
            }
        }

        // shared profiles
        if (SharedProfiles != null && SharedProfiles.Any())
        {
            // get the setting in all shared profiles
            UsrSettingCollection settings = UsrSetting.GetByKeyNameAndProfileUIds(
                dbLocation: DBLocation,
                keyName: keyName, profileUIds:
                SharedProfiles.Select(sharedProfile => sharedProfile.UId).ToArray());

            // generate inherited text
            foreach (UsrSetting setting in settings.Where(s => s != null && s.isLoadedFromDatabase))
            {
                UsrProfile sharedProfile = SharedProfiles.First(sp => sp.UId == setting.ProfileUId);

                AppApplication application = null;
                if (!Applications.TryGetValue(key: sharedProfile.ApplicationUId, value: out application))
                {
                    application = AppApplication.GetByUId(DBLocation, sharedProfile.ApplicationUId, false) ?? new AppApplication();
                    Applications.Add(key: application.UId, value: application);
                }

                string userType = (application.Name == "TPO") ? "tpoprofile" : "turretprofile";

                returnText += string.Format("<a href=\"GeneralEditionForm.aspx?action=edit&type={3}&item={0}\">{1}</a>: {2} <br />", sharedProfile.UId, sharedProfile.Name.Trim(), setting.KeyValue, userType);
                i++;
            }
        }

        if (!string.IsNullOrEmpty(returnText))
        {
            returnText = "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td>" + returnText + "</td>";
            if (i > 1)
            {
                string conflictText = "Conflict between keys!";
                string divDisplay = (keyRedefined) ? "none" : "";
                returnText +=
                    string.Format(
                        "<td><div id=\"{0}\" style=\"display:{1}\" ><img src=\"img/battention.gif\" alt=\"{2}\" title=\"{2}\"></div></td>",
                        divId, divDisplay, conflictText);
            }
            returnText += "</tr></table>";
        }

        return returnText;
    }
    #endregion

    #region --- GetBySettingKey ---
    /// <summary>
    /// Select a Setting from the dataset by his KeyName
    /// </summary>
    /// <param name="settingKey"></param>
    /// <returns></returns>
    private UsrSetting GetBySettingKey(string settingKey)
    {
        return DBStore.UsrSettingCollection.FindByKeyName(settingKey);
    }
    #endregion

    #region --- GetListItem ---
    /// <summary>
    /// Extract values from XML
    /// </summary>
    /// <param name="nodeSetting"></param>
    /// <returns>Retrieve an array of ListItem to will fill dropdown, radiobuttonlist, ...</returns>
    private static ListItem[] GetListItem(XmlNode nodeSetting, string value)
    {
        XmlNodeList choiceNodes = nodeSetting.SelectNodes("choices/choice");

        ListItem[] listItems = new ListItem[choiceNodes.Count];

        for (int nodeIndex = 0; nodeIndex < choiceNodes.Count; nodeIndex++)
        {
            // get value and text
            string choiceValue = XmlUtils.GetAttributeValue(xmlNode: choiceNodes[nodeIndex], attribueName: "value");
            string choiceText = XmlUtils.GetAttributeValue(xmlNode: choiceNodes[nodeIndex], attribueName: "text");

            // create list item
            listItems[nodeIndex] = new ListItem
            {
                Text = string.IsNullOrEmpty(choiceText) ? choiceValue : choiceText,
                Value = choiceValue,
                Selected = choiceValue == value
            };
        }

        return listItems;
    }
    #endregion

    #region --- Refresh ---
    public void Refresh()
    {
        UpdateComponentsVisibility();

        ConstructGroups(true, plhGroups);
    }
    #endregion

    #region --- UpdateData ---
    /// <summary>
    /// Update data into memory
    /// </summary>
    protected void UpdateData(string modifiedSettingID)
    {
        foreach (XmlNode nodeCategory in xmlDoc.SelectNodes("categories/category"))
        {
            string categoryName = XmlUtils.GetAttributeValue(nodeCategory, "name");

            if (categoryName == currentCategoryName)
            {
                foreach (XmlNode nodeGroup in nodeCategory.SelectNodes("groups/group"))
                {
                    string groupName = XmlUtils.GetAttributeValue(nodeGroup, "name");
                    if (groupName == SelectedGroup)
                    {
                        int i = 1;

                        foreach (XmlNode nodeSetting in nodeGroup.SelectNodes(string.Format("settings/setting[@basic_level='{0}']", BasicLevel ? "Y" : "N")))
                        {
                            string friendlyName = XmlUtils.GetAttributeValue(nodeSetting, "friendly_name");
                            string settingId = XmlUtils.GetAttributeValue(nodeSetting, "id");
                            string settingKey = XmlUtils.GetAttributeValue(nodeSetting, "name");
                            string settingType = XmlUtils.GetAttributeValue(nodeSetting, "type");
                            string settingDefaultValue = XmlUtils.GetAttributeValue(nodeSetting, "default_value");
                            string settingValidatorRequire = XmlUtils.GetAttributeValue(nodeSetting, "validator_require");

                            UsrSetting tmpS = GetBySettingKey(settingKey);

                            // get control value
                            CheckBox chbAvailable = (CheckBox)((Table)plhSettings.Controls[0]).Rows[i].Cells[0].Controls[0];
                            Control cValue = ((Table)plhSettings.Controls[0]).Rows[i].Cells[1].Controls[0];

                            // set setting value
                            string value = string.Empty;
                            if (chbAvailable.Checked)
                            {
                                switch (settingType)
                                {
                                    case "pw":
                                    case "tb":
                                        value = (modifiedSettingID == settingId) ? settingDefaultValue : ((TextBox)cValue).Text;
                                        break;

                                    case "rb":
                                    case "bl":
                                        value = (modifiedSettingID == settingId) ? settingDefaultValue : ((RadioButtonList)cValue).SelectedValue;
                                        break;

                                    case "dd":
                                        value = (modifiedSettingID == settingId) ? settingDefaultValue : ((DropDownList)cValue).SelectedValue;
                                        break;
                                }

                                if (tmpS == null)
                                {
                                    // add new 
                                    tmpS = new UsrSetting
                                    {
                                        KeyName = settingKey,
                                        KeyValue = value,
                                        ProfileUId = ProfileUId,
                                        UId = UIdGenProxy.GetNextUId(UIdGenProxy.DAOTYPE.SettingDAO, DBLocation),
                                        Version = UIdGenProxy.GetNewVersion(),
                                        Category = MergedTerminalsCategory
                                    };
                                    DBStore.UsrSettingCollection.Add(tmpS);
                                }
                                else
                                {
                                    tmpS.KeyValue = value;
                                }
                            }
                            else
                            {
                                if (tmpS != null)
                                    tmpS.DeleteInMemory();
                            }

                            i += 2;

                        }
                    }
                }
            }
        }
    }
    #endregion

    #region --- UpdateComponentsVisibility ---
    protected void UpdateComponentsVisibility()
    {
        if (!InsetAllowed.HasValue)
        {
            // Check Permission
            InsetAllowed = PermissionManager.CheckResourcePermission(Context.User, Page, Permissions.Insert);
        }

        // Update buttons visibility
        if (!InsetAllowed.HasValue || !InsetAllowed.Value)
            bSave.Visible = false;
    }
    #endregion
}
