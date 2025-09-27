<%@ Control Language="C#" AutoEventWireup="true" Inherits="UCProfileBasicSettings" Codebehind="UCProfileBasicSettings.ascx.cs" %>

<script language="javascript" type="text/javascript">
    function ChangeStateRow (nameControl, boolValueElem)
    {
        bVal = document.getElementById(boolValueElem).checked;
        
        var cells = getElementsByName_iefix('TD', nameControl);            
       
        for(var j=0; j<cells.length; j++)
        {
            ChangeStateRowRec (cells[j], bVal);
        }
        
        // div conflict
        divConflict = document.getElementById('div_' + boolValueElem);
        if (bVal)
        {
            divConflict.style.display = "none";
        }
        else
        {
            divConflict.style.display = "";
        }
    }                
    function ChangeStateRowRec (elem, bVal)
    {            
        var controls = elem.childNodes;
        
        for (var i=0; i<controls.length; i++)
        {              
            controls[i].disabled = !bVal;                 
           
            if (controls[i].nodeType == 1)
            {
                ChangeStateRowRec (controls[i], bVal);
            }                
        }
    }
</script>

<asp:UpdatePanel ID="updatePanel" runat="server">
    <ContentTemplate>

        <asp:Table ID="tableSettings" runat="server">
            <asp:TableRow>
                <asp:TableCell VerticalAlign="Top">
                    <asp:PlaceHolder ID="plhGroups" runat="server"></asp:PlaceHolder>
                </asp:TableCell>
                <asp:TableCell VerticalAlign="Top">
                    <asp:PlaceHolder ID="plhSettings" runat="server"></asp:PlaceHolder>
                    <br />
                    <br />
                    <asp:Button ID="bSave" CausesValidation="true" runat="server" OnClick="bSave_Click" Text="Update" />&nbsp;
                    <asp:Button ID="bRefresh" runat="server" Text="Refresh" OnClick="b_refresh_Click" CausesValidation="false"/>&nbsp;
                    <asp:Label ID="lUpdateStatus" runat="server" CssClass="updateMsg" Text="&nbsp;&nbsp;Updated." Visible="false" />&nbsp;
                </asp:TableCell>
            </asp:TableRow>
        </asp:Table>

    </ContentTemplate>
</asp:UpdatePanel>

<script type="text/javascript">
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_endRequest(function (s, e) {
        if (settupSettingFunction)
            settupSettingFunction();
    });
</script>